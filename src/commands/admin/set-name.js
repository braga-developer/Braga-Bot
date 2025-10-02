const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "set-name",
  description: "Troca o nome do grupo e ainda guarda o antigo, porque eu sou chique.",
  commands: ["set-name", "set-group-name", "mudar-nome-grupo", "nome-grupo"],
  usage: `${PREFIX}set-name novo nome do grupo`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    fullArgs,
    remoteJid,
    socket,
    sendErrorReply,
    sendSuccessReply,
    sendWaitReply,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new WarningError("📛 Esse comando é exclusivo para grupos. Você tá tentando usar onde, no privado? 😂");
    }

    if (!fullArgs) {
      throw new InvalidParameterError("📝 E o nome novo, cadê? Digita alguma coisa depois do comando, pelo amor.");
    }

    const minLength = 3;
    const maxLength = 40;

    if (fullArgs.length < minLength || fullArgs.length > maxLength) {
      throw new InvalidParameterError(
        `🤏 O nome precisa ter entre ${minLength} e ${maxLength} caracteres. Tenta de novo, sem exageros.`
      );
    }

    try {
      await sendWaitReply("⌛ Calma aí, tô mudando o nome do grupo...");

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const oldName = groupMetadata.subject;

      await socket.groupUpdateSubject(remoteJid, fullArgs);

      await sendSuccessReply(
        `✨ Nome do grupo alterado com sucesso!\n\n*🕘 Antes:* ${oldName}\n*⚡ Agora:* ${fullArgs}\n\nDe nada.`
      );
    } catch (error) {
      errorLog("Erro ao alterar o nome do grupo:", error);
      await sendErrorReply(
        "❌ Falha ao tentar mudar o nome. Me dá admin primeiro, depois tenta de novo, beleza?"
      );
    }
  },
};
