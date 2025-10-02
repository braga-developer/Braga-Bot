const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "transante",
  description: "🔥 Rank dos membros mais transantes do grupo!",
  commands: ["rank-transante", "transoumais", "sexometro"],
  usage: `${PREFIX}transante`,

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

    let lista = `╭━─━─━─━─━─━─━─━─━─━╮\n`;
    lista += `   🔥 *RANK DOS TRANSANTES* 🔥\n`;
    lista += `╰━─━─━─━─━─━─━─━─━─━╯\n\n`;

    const posicoes = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

    shuffled.slice(0, 10).forEach((participant, i) => {
      const transas = Math.floor(Math.random() * 200) + 1;
      const desempenho = ["🌟", "💫", "✨", "⭐", "🎯"][Math.floor(Math.random() * 5)];
      lista += `${posicoes[i]} @${participant.id.split('@')[0]} - *${transas} transas* ${desempenho}\n`;
    });

    const [primeiro, segundo, terceiro] = shuffled;

    lista += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `🏆 *PÓDIO DOS TRANSANTES* 🏆\n\n`;
    lista += `🥇 Ouro: @${primeiro.id.split('@')[0]} 👑\n`;
    lista += `🥈 Prata: @${segundo.id.split('@')[0]} 💎\n`;
    lista += `🥉 Bronze: @${terceiro.id.split('@')[0]} 🔥\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
      
