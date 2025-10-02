const { PREFIX } = require(`${BASE_DIR}/config`);
const { activateGroup } = require(`${BASE_DIR}/utils/database`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "on",
  description: "Ativa o bot no grupo",
  commands: ["on"],
  usage: `${PREFIX}on`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("😑 Esse comando só funciona em grupo, né... tenta de novo.");
    }

    activateGroup(remoteJid);

    await sendSuccessReply(`⚡ Adivinha quem voltou?  
Isso mesmo, *EU*. Pronta pra botar ordem nessa bagunça. 😎  
Aproveitem enquanto dura. 👑`);
  },
};
