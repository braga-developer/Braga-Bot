const { PREFIX, TEMP_DIR } = require(`${BASE_DIR}/config`);
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { getRandomNumber } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "toimage",
  description: "🔄 Transformo figurinhas estáticas em imagem (porque alguém ainda usa sticker estático em pleno 2024? 🙄)",
  commands: ["toimage", "toimg", "stickerpraimagem", "figurinhaboa"],
  usage: `${PREFIX}toimage (marque a figurinha) ou ${PREFIX}toimage (responda a figurinha) - Não é rocket science! 🚀`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendWaitReact,
    sendSuccessReact,
    sendImageFromFile,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError("🤦‍♂️ Amigo, isso não é uma figurinha! Precisa de óculos? 🕶️ Me marca uma figurinha de verdade!");
    }

    await sendWaitReact();

    const inputPath = await downloadSticker(webMessage, "input");
    const outputPath = path.resolve(
      TEMP_DIR,
      `${getRandomNumber(10_000, 99_999)}.png`
    );

    exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
      if (error) {
        console.log(error);
        throw new Error(`💥 Opa! Deu ruim na conversão! O ffmpeg tá de birra hoje... 😮‍💨\nErro: ${error}`);
      }

      await sendSuccessReact();

      await sendImageFromFile(outputPath, {
        caption: "🎉 Tcharam! Sua figurinha vintage agora é uma imagem moderna! Você é bem-vindo! 😎"
      });
    });
  },
};
