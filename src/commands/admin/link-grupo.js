/**
 * Comando para obter o link do grupo
 * Agora com deboche, porque pedir link é coisa de preguiçoso 😏
 *
 */
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "link-grupo",
  description: "Copia o link do grupo (caso eu tenha moral pra isso)",
  commands: ["link-grupo", "link-gp"],
  usage: `${PREFIX}link-grupo`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    socket,
    sendReact,
    sendReply,
    sendErrorReply,
    remoteJid,
  }) => {
    try {
      const groupCode = await socket.groupInviteCode(remoteJid);

      if (!groupCode) {
        throw new DangerError("🤨 Eu até tentava... se fosse admin, né.");
      }

      const groupInviteLink = `https://chat.whatsapp.com/${groupCode}`;

      await sendReact("🔗");
      await sendReply(
        `Tá na mão! Mas cuidado onde espalha isso aí... depois não reclama dos doidos entrando:\n${groupInviteLink}`
      );
    } catch (error) {
      errorLog(error);
      await sendErrorReply(
        "😑 Não consigo gerar o link, porque não sou admin.\nMe dá poder primeiro, depois a gente conversa."
      );
    }
  },
};
