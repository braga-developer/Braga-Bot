const {
  updateIsActiveGroupRestriction,
  isActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-image",
  description:
    "Ativa/desativa o recurso de anti-image no grupo, apagando a mensagem de imagem se estiver ativo.",
  commands: ["anti-image", "anti-img", "anti-imagem", "anti-imagens"],
  usage: `${PREFIX}anti-image (1/0)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("👀 Esse comando só funciona em grupo, né... nem força.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "📸 Vai digitar 1 ou 0 ou quer que eu escolha por você?"
      );
    }

    const antiImageOn = args[0] === "1";
    const antiImageOff = args[0] === "0";

    if (!antiImageOn && !antiImageOff) {
      throw new InvalidParameterError(
        "🤦‍♂️ Só aceito *1* (ligar) ou *0* (desligar). Não inventa moda."
      );
    }

    const hasActive =
      antiImageOn && isActiveGroupRestriction(remoteJid, "anti-image");

    const hasInactive =
      antiImageOff && !isActiveGroupRestriction(remoteJid, "anti-image");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `😒 O anti-image já tá ${antiImageOn ? "ligado" : "desligado"}. Faz algo útil agora.`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-image", antiImageOn);

    const status = antiImageOn ? "📵 ativado" : "📂 desativado";

    await sendSuccessReply(
      `✔️ Anti-image ${status} com sucesso!\n` +
      `Nada de fotinho por aqui ${antiImageOn ? "🎯" : "— por enquanto. 😏"}`
    );
  },
};
