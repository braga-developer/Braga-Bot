const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const {
  activateAutoResponderGroup,
  deactivateAutoResponderGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "auto-responder",
  description: "Ativa/desativa o recurso de auto-responder no grupo.",
  commands: ["auto-responder"],
  usage: `${PREFIX}auto-responder (1/0)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "🧠 Digita *1* pra ativar ou *0* pra desativar. Não tem meio-termo, beleza?"
      );
    }

    const autoResponder = args[0] === "1";
    const notAutoResponder = args[0] === "0";

    if (!autoResponder && !notAutoResponder) {
      throw new InvalidParameterError(
        "😒 Comando inválido. É *1* pra ligar, *0* pra desligar. Se não entendeu, tenta de novo... com calma."
      );
    }

    if (autoResponder) {
      activateAutoResponderGroup(remoteJid);
    } else {
      deactivateAutoResponderGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = autoResponder ? "🗣️ ativado" : "🤐 desativado";

    await sendReply(
      `✔️ Recurso de auto-responder ${context} com sucesso!\n` +
      `${autoResponder ? "Agora vou responder sozinho — porque tem gente que nem isso consegue. 🤖" : "Silêncio total. Vou fingir que nem vi. 😶‍🌫️"}`
    );
  },
};
