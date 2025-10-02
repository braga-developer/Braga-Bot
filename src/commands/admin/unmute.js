/**
 * @author Dev Gui
 */
const {
  checkIfMemberIsMuted,
  unmuteMember,
} = require(`${BASE_DIR}/utils/database`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { toUserOrGroupJid } = require(`${BASE_DIR}/utils`);

const { DangerError, WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "unmute",
  description: "Desativa o mute de um membro do grupo",
  commands: ["unmute", "desmutar"],
  usage: `${PREFIX}unmute @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, sendSuccessReply, args, isGroup, replyJid }) => {
    if (!isGroup) {
      throw new DangerError(
        "Olha, esse comando é VIP só para grupos, beleza? Aqui não rola conversa de um pra um."
      );
    }

    if (!args.length) {
      throw new DangerError(
        `E aí, não sabe quem liberar? Menciona alguém direito!\n\nExemplo: ${PREFIX}unmute @fulano`
      );
    }

    const userId = replyJid ? replyJid : toUserOrGroupJid(args[0]);

    if (!checkIfMemberIsMuted(remoteJid, userId)) {
      throw new WarningError(
        "Calma aí, o(a) figurinha já tá com microfone liberado, não precisa desmutar!"
      );
    }

    unmuteMember(remoteJid, userId);

    await sendSuccessReply(
      "Olha só quem voltou a falar! Usuário desmutado com sucesso! 🎉"
    );
  },
};
