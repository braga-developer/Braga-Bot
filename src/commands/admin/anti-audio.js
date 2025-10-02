const {
  updateIsActiveGroupRestriction,
  isActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { WarningError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-audio",
  description:
    "Ativa/desativa o recurso de anti-audio no grupo, apagando a mensagem de áudio se estiver ativo.",
  commands: ["anti-audio", "anti-audios"],
  usage: `${PREFIX}anti-audio (1/0)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("🙄 Esse comando é pra grupo, né. Nem tenta no PV.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "📢 Vai digitar 1 ou 0, ou quer que eu adivinhe sua vontade?"
      );
    }

    const antiAudioOn = args[0] === "1";
    const antiAudioOff = args[0] === "0";

    if (!antiAudioOn && !antiAudioOff) {
      throw new InvalidParameterError(
        "🧠 Usa a cabeça: é *1* pra ligar ou *0* pra desligar. Só isso."
      );
    }

    const hasActive =
      antiAudioOn && isActiveGroupRestriction(remoteJid, "anti-audio");

    const hasInactive =
      antiAudioOff && !isActiveGroupRestriction(remoteJid, "anti-audio");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `😒 O anti-áudio já tá ${antiAudioOn ? "ligado" : "desligado"}, gênio.`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-audio", antiAudioOn);

    const status = antiAudioOn ? "⚔️ ativado" : "💤 desativado";

    await sendSuccessReply(
      `✔️ Recurso anti-áudio ${status} com sucesso.\n` +
      `Agora respeitem o silêncio... ou não. Eu cuido disso. 😌`
    );
  },
};
