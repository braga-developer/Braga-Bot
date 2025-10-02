const fs = require("node:fs");
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, DangerError } = require(`${BASE_DIR}/errors`);
const {
  isAnimatedSticker,
  processStaticSticker,
  processAnimatedSticker,
  addStickerMetadata,
} = require(`${BASE_DIR}/services/sticker`);
const { getRandomName } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "rename",
  description: "🔄 Dando uma repaginada nos meta-dados da figurinha! ✨",
  commands: ["rename", "renomear", "rn", "mudarnome", "customizar"],
  usage: `${PREFIX}rename pacote / autor (responda a uma figurinha) - Sim, é só isso mesmo! 🤷‍♂️`,
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendWaitReact,
    sendSuccessReact,
    sendStickerFromFile,
    args,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError(
        "🤨 Cadê a figurinha, amigo? Tá me vendo cara de adivinho? Marca a figurinha que você quer dar uma repaginada! 🎨"
      );
    }

    if (args.length !== 2) {
      throw new InvalidParameterError(
        `💥 Opa! Faltou alguma coisa!\nFormato correto: ${PREFIX}rename **pacote** / **autor**\n\nExemplo: ${PREFIX}rename Memes da Galera / Zé da Esquina 🏷️`
      );
    }

    const pack = args[0];
    const author = args[1];

    if (!pack || !author) {
      throw new InvalidParameterError(
        "🚨 Ei, ei, ei! Não pode deixar campo vazio não!\nPreciso do **pacote** E do **autor**, tá bom? 😤"
      );
    }

    const minLength = 2;
    const maxLength = 50;

    if (pack.length < minLength || pack.length > maxLength) {
      throw new DangerError(
        `📏 Nossa, que pacote esquisito!\nPrecisa ter entre ${minLength} e ${maxLength} caracteres, não é difícil! 🤦‍♀️\n\nVocê colocou: ${pack.length} caracteres`
      );
    }

    if (author.length < minLength || author.length > maxLength) {
      throw new DangerError(
        `📏 Autor muito ambicioso, hein?\nTem que ter entre ${minLength} e ${maxLength} caracteres só! 😅\n\nVocê colocou: ${author.length} caracteres`
      );
    }

    let finalStickerPath = null;

    await sendWaitReact();

    const inputPath = await downloadSticker(webMessage, getRandomName("webp"));

    try {
      const metadata = {
        username: pack,
        botName: author,
      };

      const isAnimated = await isAnimatedSticker(inputPath);

      if (isAnimated) {
        finalStickerPath = await processAnimatedSticker(
          inputPath,
          metadata,
          addStickerMetadata
        );
      } else {
        finalStickerPath = await processStaticSticker(
          inputPath,
          metadata,
          addStickerMetadata
        );
      }

      await sendSuccessReact();

      await sendStickerFromFile(finalStickerPath, {
        caption: `🎉 Prontinho! Figurinha customizada com:\n📦 **Pacote:** ${pack}\n👨‍🎨 **Autor:** ${author}\n\nAgora tá show! 😎`
      });
    } catch (error) {
      throw new Error(`💥 Ai, deu ruim! O computador ficou confuso... 🤖\nErro: ${error.message}\n\nTenta de novo aí, vai que cola! 🍀`);
    } finally {
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (finalStickerPath && fs.existsSync(finalStickerPath)) {
        fs.unlinkSync(finalStickerPath);
      }
    }
  },
};
