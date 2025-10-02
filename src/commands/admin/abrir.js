const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "abrir",
  description: "Abre o grupo.",
  commands: [
    "abrir",
    "abri",
    "abre",
    "abrir-grupo",
    "abri-grupo",
    "abre-grupo",
    "open",
    "open-group",
  ],
  usage: `${PREFIX}abrir`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "not_announcement");
      await sendSuccessReply("🚪 Grupo aberto, podem fazer bagunça... Mas lembrem que quem manda aqui sou eu. 😎");
    } catch (error) {
      await sendErrorReply(
        "🤷‍♂️ Pra eu abrir esse grupo, preciso ser administrador. Tenta arrumar isso aí antes de pedir favores."
      );
      errorLog(
        `Erro ao abrir o grupo! Detalhes: ${JSON.stringify(error, null, 2)}`
      );
    }
  },
};
