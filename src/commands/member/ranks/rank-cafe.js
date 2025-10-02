const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "cafe",
  description: "☕ Rank dos viciados em café do grupo!",
  commands: ["rank-cafe", "cafemetro", "cafezeiro"],
  usage: `${PREFIX}cafe`,

  handle: async ({ sendText, getGroupMetadata, chatId, isGroup }) => {
    if (!isGroup) {
      throw new InvalidParameterError("❌ Este comando só pode ser usado em grupos!");
    }

    const groupMetadata = await getGroupMetadata(chatId);
    const participants = groupMetadata.participants;

    if (!participants.length) {
      throw new InvalidParameterError("❌ Nenhum membro encontrado no grupo.");
    }

    const shuffled = participants.sort(() => Math.random() - 0.5);

    let lista = `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
    lista += `      ☕ *RANK CAFÉ* ☕\n`;
    lista += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const xicaras = Math.floor(Math.random() * 20) + 1;
      const nivel = Math.floor(Math.random() * 100) + 1;
      
      let emoji, status;
      if (nivel > 90) {
        emoji = "🤯⚡";
        status = "VICIADO ABSOLUTO";
      } else if (nivel > 70) {
        emoji = "💀☕";
        status = "Café no sangue";
      } else if (nivel > 50) {
        emoji = "😎🌟";
        status = "Apreciador";
      } else {
        emoji = "😴";
        status = "Iniciante";
      }
      
      lista += `*${i + 1}.* @${participant.id.split('@')[0]}\n`;
      lista += `   ☕ *${xicaras} xícaras/dia*\n`;
      lista += `   📊 ${nivel}% viciado ${emoji}\n`;
      lista += `   🏷️ ${status}\n\n`;
    });

    const [cafezeiro, vice, terceiro] = shuffled;

    lista += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `🏆 *REIS DO CAFÉ* 🏆\n\n`;
    lista += `👑 @${cafezeiro.id.split('@')[0]} - *Barista Supremo* 🤯\n`;
    lista += `🥈 @${vice.id.split('@')[0]} - *Mestre da Cafeína* ⚡\n`;
    lista += `🥉 @${terceiro.id.split('@')[0]} - *Degustador Profissional* ☕\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
