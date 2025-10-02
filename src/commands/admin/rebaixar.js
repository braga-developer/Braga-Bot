const { PREFIX } = require(`${BASE_DIR}/config`);
const { isGroup, toUserOrGroupJid } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "rebaixar",
  description: "Tira o poderzinho de admin de quem já se achou demais.",
  commands: ["rebaixar", "rebaixa", "demote"],
  usage: `${PREFIX}rebaixar @usuario`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    remoteJid,
    socket,
    sendWarningReply,
    sendSuccessReply,
    sendErrorReply,
  }) => {
    if (!isGroup(remoteJid)) {
      return sendWarningReply("📛 Esse comando só funciona em grupo. Nem tenta no privado, por favor.");
    }

    if (!args.length || !args[0]) {
      return sendWarningReply("🫵 Marca alguém primeiro, gênio. Preciso saber quem você quer rebaixar.");
    }

    const userId = toUserOrGroupJid(args[0]);

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "demote");
      await sendSuccessReply("🪫 Usuário rebaixado com sucesso! O cargo subiu à cabeça? Problema resolvido.");
    } catch (error) {
      errorLog(`Erro ao rebaixar administrador: ${error.message}`);
      await sendErrorReply(
        "🚫 Não consegui rebaixar o ser. Provavelmente porque eu não sou admin — que ironia, né?"
      );
    }
  },
};
