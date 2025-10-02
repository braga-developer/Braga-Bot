const fs = require("node:fs");
const path = require("node:path");
const { exec } = require("node:child_process");
const { getRandomName } = require(`${BASE_DIR}/utils`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX, TEMP_DIR } = require(`${BASE_DIR}/config`);

const efeitosDisponiveis = {
  hdr: "eq=contrast=1.3:brightness=0.05:saturation=1.5",
  contrast: "eq=contrast=1.5",
  brilho: "eq=brightness=0.2",
  sépia: "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131",
  grayscale: "hue=s=0",
  invert: "negate",
  "mais-qualidade": "scale=1280:1280:force_original_aspect_ratio=decrease",
  blur: "boxblur=5:1",
  sharpen: "unsharp=5:5:1.0:5:5:0.0",
  saturado: "eq=saturation=2",
  vintage: "curves=vintage",
  cartoon: "edgedetect=low=0.1:high=0.4"
};

module.exports = {
  name: "efeito-img",
  description: "Aplica efeitos estilosos em imagens 🎨🤳",
  commands: ["efeito-img"],
  usage: `${PREFIX}efeito-img <efeito> (marque uma imagem)`,
  handle: async ({
    isImage,
    args,
    downloadImage,
    webMessage,
    sendImageFromFile,
    sendErrorReply,
    sendWaitReact,
    sendSuccessReact
  }) => {
    if (!isImage) {
      throw new InvalidParameterError(
        `💩 Você precisa marcar ou responder *uma imagem* primeiro, bebê!`
      );
    }

    const efeito = args[0]?.toLowerCase();
    if (!efeito || !efeitosDisponiveis[efeito]) {
      const lista = Object.keys(efeitosDisponiveis)
        .map((e) => `👉 *${e}*`)
        .join("\n");
      throw new InvalidParameterError(
        `🤡 Cadê o parâmetro, anjo? Use assim:\n\n${PREFIX}efeito-img *<efeito>*\n\n✨ *Efeitos disponíveis:*\n${lista}`
      );
    }

    await sendWaitReact();

    const inputPath = await downloadImage(webMessage, getRandomName());
    const outputPath = path.resolve(TEMP_DIR, getRandomName("jpg"));

    await new Promise((resolve, reject) => {
      const cmd = `ffmpeg -i "${inputPath}" -vf "${efeitosDisponiveis[efeito]}" "${outputPath}"`;
      exec(cmd, (error, _, stderr) => {
        if (error) {
          console.error("FFmpeg error:", stderr);
          reject(error);
        } else resolve();
      });
    });

    await sendImageFromFile(
      outputPath,
      `✅ Efeito *${efeito}* aplicado com sucesso!\n🔥 Sua obra-prima tá na mão 🎨🤳`
    );

    await sendSuccessReact();

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  }
};
