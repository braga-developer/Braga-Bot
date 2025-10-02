const {
  updateIsActiveGroupRestriction,
  isActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-document",
  description:
    "Ativa/desativa o recurso de anti-document no grupo, apagando a mensagem de documento se estiver ativo.",
  commands: ["anti-document", "anti-doc", "anti-documento", "anti-documentos"],
  usage: `${PREFIX}anti-document (1/0)`,
  
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("🙄 Só funciona em grupo, tá? Para de testar.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "🧐 Digita 1 pra ligar ou 0 pra desligar. Não é ciência de foguete."
      );
    }

    const antiDocumentOn = args[0] === "1";
    const antiDocumentOff = args[0] === "0";

    if (!antiDocumentOn && !antiDocumentOff) {
      throw new InvalidParameterError(
        "🤦‍♂️ Já falei: só 1 ou 0. Tá difícil entender?"
      );
    }

    const hasActive =
      antiDocumentOn && isActiveGroupRestriction(remoteJid, "anti-document");

    const hasInactive =
      antiDocumentOff && !isActiveGroupRestriction(remoteJid, "anti-document");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `😴 O anti-document já tá ${antiDocumentOn ? "ligado" : "desligado"}. Para de repetir!`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-document", antiDocumentOn);

    const status = antiDocumentOn ? "⚔️ ativado" : "💤 desativado";

    await sendSuccessReply(
      `✔️ Anti-document ${status} com sucesso! Agora documentos? Só se for autorizado por mim. 😎`
    );
  },
};
