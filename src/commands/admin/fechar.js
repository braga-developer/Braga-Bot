const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "fechar",
  description: "Fecha o grupo.",
  commands: [
    "fechar",
    "fecha",
    "fechar-grupo",
    "fecha-grupo",
    "close",
    "close-group",
  ],
  usage: `${PREFIX}fechar`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "announcement");

      await sendSuccessReply(
        "🔒 Grupo fechado com sucesso!\n" +
        "Agora só os chefes falam. Quem quiser reclamar, manda um e-mail… que eu vou ignorar. 😌"
      );
    } catch (error) {
      await sendErrorReply(
        "😤 Eu até tentaria fechar o grupo, mas né… preciso ser ADM antes de sair bancando o tirano."
      );

      errorLog(
        `❌ Erro ao tentar fechar o grupo:\n${JSON.stringify(error, null, 2)}`
      );
    }
  },
};
