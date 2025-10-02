const {
  updateIsActiveGroupRestriction,
  isActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-event",
  description:
    "Ativa/desativa o recurso de anti-event no grupo, apagando a mensagem de evento se estiver ativo.",
  commands: ["anti-event", "anti-evento", "anti-eventos"],
  usage: `${PREFIX}anti-event (1/0)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("🙄 Só em grupo, tá? Não me faça repetir.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "🤷‍♂️ Digita 1 pra ligar, 0 pra desligar. Fácil, né?"
      );
    }

    const antiEventOn = args[0] === "1";
    const antiEventOff = args[0] === "0";

    if (!antiEventOn && !antiEventOff) {
      throw new InvalidParameterError(
        "🧠 Só aceita 1 ou 0, meu filho. Não complica."
      );
    }

    const hasActive =
      antiEventOn && isActiveGroupRestriction(remoteJid, "anti-event");

    const hasInactive =
      antiEventOff && !isActiveGroupRestriction(remoteJid, "anti-event");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `😴 Já tá ${antiEventOn ? "ligado" : "desligado"}. Para de insistir!`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-event", antiEventOn);

    const status = antiEventOn ? "⚔️ ativado" : "💤 desativado";

    await sendSuccessReply(
      `✔️ Anti-event ${status} com sucesso! Eventos chato? Tô cuidando disso. 😎`
    );
  },
};
