const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "listaradmins",
  description: "👑 Lista todos os administradores do grupo",
  commands: ["listaradmins", "listadmins", "admins", "administradores"],
  usage: `${PREFIX}listaradmins`,

  handle: async ({ remoteJid, sendReply, getGroupMetadata, isGroup }) => {
    if (!isGroup) {
      throw new DangerError("❌ Este comando só pode ser usado em grupos!");
    }

    const groupMetadata = await getGroupMetadata();
    const admins = groupMetadata.participants.filter(p => p.admin);

    if (admins.length === 0) {
      return sendReply("ℹ️ Não há administradores neste grupo.");
    }

    let adminList = "👑 *ADMINISTRADORES DO GRUPO:*\n\n";
    admins.forEach((admin, index) => {
      adminList += `${index + 1}. @${admin.id.split('@')[0]}\n`;
    });

    adminList += `\n📊 Total: ${admins.length} admin(s)`;
    
    await sendReply(adminList, admins.map(admin => admin.id));
  },
};
