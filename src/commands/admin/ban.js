const {
  PREFIX,
  BOT_NUMBER,
  OWNER_NUMBER,
  ONWER_LID,
} = require(`${BASE_DIR}/config`);

const { DangerError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const {
  toUserOrGroupJid,
  onlyNumbers,
  toUserJid,
} = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "ban",
  description: "Remove um membro do grupo com classe (ou não)",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @marcar_membro\n\nou\n\n${PREFIX}ban (respondendo uma mensagem)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    try {
      if (!args.length && !isReply) {
        throw new InvalidParameterError(
          "👀 Cadê o @ ou a mensagem respondida? Quer que eu chute alguém aleatório?"
        );
      }

      const userId = toUserOrGroupJid(args[0]);
      const memberToRemoveJid = isReply ? replyJid : userId;
      const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

      if (!memberToRemoveJid) {
        throw new InvalidParameterError("❌ Alvo inválido. Nem sei quem é essa pessoa.");
      }

      if (memberToRemoveJid === userJid) {
        throw new DangerError("🪞 Tá tentando se banir? Autoestima tá em dia, hein?");
      }

      if (
        memberToRemoveNumber === OWNER_NUMBER ||
        memberToRemoveNumber + "@lid" === ONWER_LID
      ) {
        throw new DangerError("🤡 Eu hein, tentando quicar o dono do bot? Boa sorte na próxima vida.");
      }

      const botJid = toUserJid(BOT_NUMBER);

      if (memberToRemoveJid === botJid) {
        throw new DangerError("😤 Me banir? A ousadia bateu forte aí, né?");
      }

      await socket.groupParticipantsUpdate(
        remoteJid,
        [memberToRemoveJid],
        "remove"
      );

      await sendSuccessReact();

      await sendReply(
        "✅ Membro removido com sucesso!\n🚪 Que sirva de exemplo pros próximos."
      );
    } catch (error) {
      console.log(error);

      await sendErrorReply(
        `❌ Não consegui remover o membro:\n${error.message || "Erro desconhecido"}`
      );
    }
  },
};
