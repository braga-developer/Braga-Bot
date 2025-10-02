const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "gay",
  description: "🌈 Rank oficial dos membros mais gays do grupo!",
  commands: ["rank-gay", "gaymetro", "gayrank", "lesbica"],
  usage: `${PREFIX}gay`,

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
    lista += `      🌈 *RANK GAY* 🌈\n`;
    lista += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const nivel = Math.floor(Math.random() * 100) + 1;
      let emoji;
      if (nivel > 90) emoji = "🏳️‍🌈💫";
      else if (nivel > 70) emoji = "✨👑";
      else if (nivel > 50) emoji = "💖🌟";
      else if (nivel > 30) emoji = "🌸😊";
      else emoji = "👀";
      
      lista += `${i + 1}️⃣ @${participant.id.split('@')[0]} - *${nivel}% gay* ${emoji}\n`;
    });

    const [campeao, vice, terceiro] = shuffled;

    lista += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `🏆 *PÓDIO GAY* 🏆\n\n`;
    lista += `🥇 @${campeao.id.split('@')[0]} - *Rainha Gay Suprema* 👑🏳️‍🌈\n`;
    lista += `🥈 @${vice.id.split('@')[0]} - *Príncipe Encantado* ✨💕\n`;
    lista += `🥉 @${terceiro.id.split('@')[0]} - *Dama da Diversidade* 🌈🌟\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
