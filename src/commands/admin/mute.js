const {
  toUserOrGroupJid,
  onlyNumbers,
  toUserJid,
} = require(`${BASE_DIR}/utils`);
const {
  checkIfMemberIsMuted,
  muteMember,
} = require(`${BASE_DIR}/utils/database`);
const {
  PREFIX,
  BOT_NUMBER,
  OWNER_NUMBER,
  OWNER_LID,
} = require(`${BASE_DIR}/config`);

const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "mute",
  description:
    "Silencia um usuário no grupo (apaga as mensagens do usuário automaticamente).",
  commands: ["mute", "mutar"],
  usage: `${PREFIX}mute @usuario ou (responda à mensagem do usuário que deseja mutar)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    remoteJid,
    replyJid,
    sendErrorReply,
    sendSuccessReply,
    getGroupMetadata,
    isGroup,
  }) => {
    if (!isGroup) {
      return sendErrorReply(
        "Amigo, isso aqui é um grupo, não seu bate-papo particular. Use lá no grupo, beleza?"
      );
    }

    if (!args.length && !replyJid) {
      return sendErrorReply(
        `Vai precisar me dizer quem é o folgado que quer calar a boca.\n\nUse assim: ${PREFIX}mute @fulano ou responde a mensagem dele, né!`
      );
    }

    const userId = replyJid || toUserOrGroupJid(args[0]);
    const targetUserNumber = onlyNumbers(userId);

    if ([OWNER_NUMBER, OWNER_LID.replace("@lid", "")].includes(targetUserNumber)) {
      return sendErrorReply(
        "Quer mutar o dono do bot? Tá de sacanagem, né? Vai tentar de novo!"
      );
    }

    if (userId === toUserJid(BOT_NUMBER)) {
      return sendErrorReply(
        "Mutar o bot? Você é louco? Eu sou mais educado que você!"
      );
    }

    const groupMetadata = await getGroupMetadata();

    const isUserInGroup = groupMetadata.participants.some(
      (participant) => participant.id === userId
    );

    if (!isUserInGroup) {
      return sendErrorReply(
        `O tal do @${targetUserNumber} nem tá nesse rolê aqui, pra que mutar?`
      );
    }

    const isTargetAdmin = groupMetadata.participants.some(
      (participant) => participant.id === userId && participant.admin
    );

    if (isTargetAdmin) {
      return sendErrorReply(
        "Mutar um administrador? Tá querendo confusão, né? Relaxa aí."
      );
    }

    const isMuted = await checkIfMemberIsMuted(remoteJid, userId);

    if (isMuted) {
      return sendErrorReply(
        `O @${targetUserNumber} já tá no modo fantasma, quietinho... Não precisa mutar de novo!`
      );
    }

    await muteMember(remoteJid, userId);

    await sendSuccessReply(
      `Shhh... @${targetUserNumber} agora tá no modo ninja: sem falar nada no grupo! 🎧🤫`,
      [userId]
    );
  },
};
