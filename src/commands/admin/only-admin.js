const {
  activateOnlyAdmins,
  deactivateOnlyAdmins,
  isActiveOnlyAdmins,
} = require("../../utils/database");

const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "only-admin",
  description: "Ativa o modo 'só os brabos' — apenas administradores podem usar meus comandos.",
  commands: [
    "only-admin",
    "only-adm",
    "only-administrator",
    "only-admins",
    "so-adm",
    "so-admin",
    "so-administrador",
    "so-admins",
  ],
  usage: `${PREFIX}only-admin 1`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "📛 Faltou o argumento! Digita 1 pra ativar ou 0 pra desativar, não é difícil."
      );
    }

    const onlyAdminOn = args[0] == "1";
    const onlyAdminOff = args[0] == "0";

    if (!onlyAdminOn && !onlyAdminOff) {
      throw new InvalidParameterError(
        "🤔 Argumento inválido. É 1 ou 0, simples assim. Não complica."
      );
    }

    const hasActive = onlyAdminOn && isActiveOnlyAdmins(remoteJid);
    const hasInactive = onlyAdminOff && !isActiveOnlyAdmins(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `⚠️ O modo 'só os chefes' já está ${onlyAdminOn ? "ativado" : "desativado"}! Vai prestar atenção antes de mandar comando à toa.`
      );
    }

    if (onlyAdminOn) {
      activateOnlyAdmins(remoteJid);
    } else {
      deactivateOnlyAdmins(remoteJid);
    }

    await sendSuccessReact();

    const context = onlyAdminOn ? "ativado" : "desativado";

    await sendReply(
      `🔒 Modo 'somente admins' ${context} com sucesso!\nAgora só quem manda pode usar meus comandos. O resto… só assiste.`
    );
  },
};
