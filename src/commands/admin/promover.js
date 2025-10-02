const { PREFIX } = require(`${BASE_DIR}/config`);
const { isGroup, toUserOrGroupJid } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "promover",
  description: "Entrega a coroa de admin pra quem (ainda) não decepcionou.",
  commands: ["promover", "promove", "promote", "add-adm"],
  usage: `${PREFIX}promover @usuario`,

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
      return sendWarningReply("❌ Esse comando só faz sentido em grupos. Tenta de novo onde faz sentido.");
    }

    if (!args.length || !args[0]) {
      return sendWarningReply("🫵 Você esqueceu de marcar alguém, gênio. Quem você quer promover?");
    }

    const userId = toUserOrGroupJid(args[0]);

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "promote");

      await sendSuccessReply("👑 Pronto, o reinado começou. Usuário promovido com sucesso!");
    } catch (error) {
      errorLog(`Erro ao promover usuário: ${error.message}`);
      await sendErrorReply(
        "🚫 Falha ao tentar promover o ser escolhido. Talvez eu precise ser admin, né? Só talvez."
      );
    }
  },
};
