const { PREFIX } = require(`${BASE_DIR}/config`);
const { deactivateGroup } = require(`${BASE_DIR}/utils/database`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "off",
  description: "Desativa o bot no grupo",
  commands: ["off"],
  usage: `${PREFIX}off`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("🤨 Esse comando só funciona em grupo, campeão.");
    }

    deactivateGroup(remoteJid);

    await sendSuccessReply(`💤 Tá bom, já entendi o recado...  
Desligando meus poderes neste grupo.  
Chamem quando sentirem minha falta. Ou não. 🤷‍♀️`);
  },
};
