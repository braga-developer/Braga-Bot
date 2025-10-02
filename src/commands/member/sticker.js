const fs = require("node:fs");
const path = require("node:path");
const { exec } = require("node:child_process");
const { getRandomName } = require(`${BASE_DIR}/utils`);
const { addStickerMetadata } = require(`${BASE_DIR}/services/sticker`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX, BOT_NAME, BOT_EMOJI, TEMP_DIR } = require(`${BASE_DIR}/config`);

const efeitosSticker = {
  0: null, // sem efeito
  hdr: "eq=contrast=1.3:brightness=0.05:saturation=1.5",
  contrast: "eq=contrast=1.5",
  sépia: "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131",
  grayscale: "hue=s=0",
  invert: "negate",
  brilho: "eq=brightness=0.3",
  escuro: "eq=brightness=-0.3",
  saturado: "eq=saturation=2",
  dessaturado: "eq=saturation=0.3",
  pixelado: "scale=64:64:force_original_aspect_ratio=decrease,scale=512:512:flags=neighbor",
  blur: "boxblur=10:1",
  espelhado: "hflip",
  virado: "vflip",
  "mais-qualidade": "scale=1280:1280:force_original_aspect_ratio=decrease"
};

module.exports = {
  name: "sticker",
  description: "Cria figurinhas com *efeitos estilosos* 😏✨",
  commands: ["f", "s", "sticker", "fig"],
  usage: `${PREFIX}sticker <efeito|0> (marque imagem/gif/vídeo)`,

  handle: async ({
    isImage,
    isVideo,
    args,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendWaitReact,
    sendSuccessReact,
    sendStickerFromFile,
    userJid,
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        `🤡 Você precisa marcar ou responder uma *imagem/gif/vídeo*!`
      );
    }

    const efeito = args[0]?.toLowerCase();
    if (!efeito || !(efeito in efeitosSticker)) {
      const lista = Object.keys(efeitosSticker)
        .map((e) => `👉 *${e}*`)
        .join("\n");

      throw new InvalidParameterError(
        `😒 Você esqueceu o *efeito*!\n\nUse assim:\n*${PREFIX}sticker <efeito>*\n\n✨ Efeitos disponíveis:\n${lista}`
      );
    }

    await sendWaitReact();

    const username =
      webMessage.pushName ||
      webMessage.notifyName ||
      userJid.replace(/@s.whatsapp.net/, "");

    const metadata = {
      username,
      botName: `${BOT_EMOJI} ${BOT_NAME}`,
    };

    const outputTempPath = path.resolve(TEMP_DIR, getRandomName("webp"));
    let inputPath = null;

    try {
      if (isImage) {
        inputPath = await downloadImage(webMessage, getRandomName());

        await new Promise((resolve, reject) => {
          // aplica filtro se não for "0"
          const filtro = efeitosSticker[efeito]
            ? `-vf "${efeitosSticker[efeito]},scale=512:512:force_original_aspect_ratio=decrease"`
            : `-vf "scale=512:512:force_original_aspect_ratio=decrease"`;

          const cmd = `ffmpeg -i "${inputPath}" ${filtro} -f webp -quality 90 "${outputTempPath}"`;

          exec(cmd, (error, _, stderr) => {
            if (error) {
              console.error("FFmpeg error:", stderr);
              reject(error);
            } else resolve();
          });
        });
      } else {
        inputPath = await downloadVideo(webMessage, getRandomName());

        const maxDuration = 10;
        const seconds =
          webMessage.message?.videoMessage?.seconds ||
          webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.videoMessage?.seconds;

        if (!seconds || seconds > maxDuration) {
          if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          return sendErrorReply(
            `⏱️ O vídeo tem mais de *${maxDuration} segundos*! Envie um menorzinho, preguiçoso.`
          );
        }

        await new Promise((resolve, reject) => {
          const filtro = efeitosSticker[efeito]
            ? `${efeitosSticker[efeito]},scale=512:512, fps=15`
            : "scale=512:512, fps=15";

          const cmd = `ffmpeg -y -i "${inputPath}" -vcodec libwebp -fs 0.99M -filter_complex "[0:v] ${filtro},split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" -f webp "${outputTempPath}"`;

          exec(cmd, (error, _, stderr) => {
            if (error) {
              console.error("FFmpeg error:", stderr);
              reject(error);
            } else resolve();
          });
        });
      }

      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

      const stickerPath = await addStickerMetadata(
        await fs.promises.readFile(outputTempPath),
        metadata
      );

      await sendSuccessReact();
      await sendStickerFromFile(stickerPath);

      if (fs.existsSync(outputTempPath)) fs.unlinkSync(outputTempPath);
      if (fs.existsSync(stickerPath)) fs.unlinkSync(stickerPath);
    } catch (error) {
      console.error("Erro no comando sticker:", error);
      throw new Error(`💥 Erro ao criar figurinha: *${error.message}*`);
    }
  },
};
