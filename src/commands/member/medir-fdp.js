const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { exec } = require("child_process");

const { getRandomName } = require(`${BASE_DIR}/utils`);
const { addStickerMetadata } = require(`${BASE_DIR}/services/sticker`);
const { PREFIX, BOT_EMOJI, BOT_NAME, TEMP_DIR } = require(`${BASE_DIR}/config`);

async function baixarEConverterGif(url) {
  const gifPath = path.resolve(TEMP_DIR, getRandomName("gif"));
  const webpPath = path.resolve(TEMP_DIR, getRandomName("webp"));

  const response = await axios.get(url, { responseType: "arraybuffer" });
  await fs.promises.writeFile(gifPath, response.data);

  const stats = fs.statSync(gifPath);
  if (!stats.size || stats.size < 1024) {
    throw new Error("GIF inválido ou corrompido");
  }

  await new Promise((resolve, reject) => {
    const cmd = `ffmpeg -y -i "${gifPath}" -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512:force_original_aspect_ratio=decrease,fps=15,split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" "${webpPath}"`;
    exec(cmd, (error, _, stderr) => {
      if (error) {
        console.error("Erro FFmpeg:", stderr);
        reject(error);
      } else resolve();
    });
  });

  if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
  return webpPath;
}

module.exports = {
  name: "medir-fdp",
  description: "📊 Mede o nível de *FDP* de alguém 😂",
  commands: ["medir-fdp", "fdpmetro"],
  usage: `${PREFIX}medir-fdp @alguém`,

  handle: async ({ webMessage, args, sendReply, sendStickerFromFile }) => {
    const mencionado = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    let alvo, alvoId;
    if (mencionado) {
      alvo = `@${mencionado.split('@')[0]}`;
      alvoId = mencionado;
    } else if (args[0] && args[0].includes('@')) {
      alvo = args[0];
      alvoId = args[0] + (args[0].includes('.') ? '' : '@s.whatsapp.net');
    } else {
      alvo = "você mesmo";
      alvoId = null;
    }

    const nivel = Math.floor(Math.random() * 101);

    let frase, gifURL;
    if (nivel < 40) {
      frase = "😏 *Nível FDP: Baixo* (só de leve, ainda dá pra confiar)";
      gifURL = "https://imgs.search.brave.com/5Urgxra9_3wCyDgdrLhB3MsonDSwYPYNoTlX_Y_Dzyw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9naWZk/Yi5jb20vaW1hZ2Vz/L2hpZ2gvZnVsbG1l/dGFsLWFsY2hlbWlz/dC00OTgteC0yNzgt/Z2lmLXU3Nm1sZWZ1/dTNzYzE2aHkuZ2lm.gif";
    } else if (nivel < 80) {
      frase = "🤨 *Nível FDP: Médio* (já começa a dar trabalho)";
      gifURL = "https://imgs.search.brave.com/VCrDvJtn0P8rr8cUTOpsodYG6IJK3I4USCc9rFABxpg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wYTEu/YW1pbm9hcHBzLmNv/bS82NTU2LzI1MDRm/MWIxOTllOGRlNTQz/ZTQ2MmI3Y2YxMWC4/ZDY3ZTdmMDYzODdf/aHEuZ2lm.gif";
    } else {
      frase = "🔥 *Nível FDP: ABSOLUTO!* (não dá pra salvar 🤡)";
      gifURL = "https://media.tenor.com/9LaQ3vtV8iYAAAAM/fullmetal-alchemist-edward-elric.gif";
    }

    await sendReply(
      `📊 *FDP-METRO™* 📊\n\n👤 Alvo: ${alvo}\n${frase}\n📈 Porcentagem: *${nivel}%*`,
      alvoId ? [alvoId] : []
    );

    try {
      const webpPath = await baixarEConverterGif(gifURL);
      const stickerPath = await addStickerMetadata(
        await fs.promises.readFile(webpPath),
        { username: "fdp-bot", botName: `${BOT_EMOJI} ${BOT_NAME}` }
      );

      await sendStickerFromFile(stickerPath);

      if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath);
      if (fs.existsSync(stickerPath)) fs.unlinkSync(stickerPath);
    } catch (err) {
      console.error("Erro ao gerar figurinha do medir-fdp:", err);
      await sendReply("💔 Não consegui mandar a figurinha, mas o FDP tá marcado 😂");
    }
  },
};
