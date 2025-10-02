const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "bvl",
  description: "🚫 Rank BVL - Baitola Virgem de Luxo do grupo!",
  commands: ["rank-bvl", "bvl", "baitola"],
  usage: `${PREFIX}bvl`,

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
    lista += `     🚫 *RANK BVL* 🚫\n`;
    lista += `  *Baitola Virgem de Luxo*\n`;
    lista += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const pontosBVL = Math.floor(Math.random() * 100) + 1;
      
      let titulo;
      if (pontosBVL > 95) titulo = "🌟 BVL LENDÁRIO";
      else if (pontosBVL > 80) titulo = "💎 BVL SUPREMO";
      else if (pontosBVL > 60) titulo = "✨ BVL PROFISSIONAL";
      else if (pontosBVL > 40) titulo = "⭐ BVL INTERMEDIÁRIO";
      else titulo = "🔰 BVL INICIANTE";

      lista += `*${i + 1}.* @${participant.id.split('@')[0]}\n`;
      lista += `   🎯 *${pontosBVL} pontos BVL*\n`;
      lista += `   👑 ${titulo}\n\n`;
    });

    const reiBVL = shuffled[Math.floor(Math.random() * shuffled.length)];

    lista += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `🏆 *REI BVL OFICIAL* 🏆\n\n`;
    lista += `@${reiBVL.id.split('@')[0]} 👑\n`;
    lista += `*Baitola Virgem de Luxo Supremo!* 🚫💎\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
