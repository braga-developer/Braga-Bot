const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "cabaco",
  description: "😈 Rank dos maiores cabaços/virgens do grupo!",
  commands: ["rank-cabaco", "cabacometro", "virgem", "bvl"],
  usage: `${PREFIX}cabaco`,

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
    lista += `     😈 *RANK CABACO* 😈\n`;
    lista += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const tempoVirgem = Math.floor(Math.random() * 25) + 1;
      const nivelCabaco = Math.floor(Math.random() * 100) + 1;
      
      let emoji, status;
      
      if (nivelCabaco > 90) {
        emoji = "😱👶";
        status = "CABAÇO MÍTICO";
      } else if (nivelCabaco > 70) {
        emoji = "🙈🍼";
        status = "Virjão Master";
      } else if (nivelCabaco > 50) {
        emoji = "😳🌟";
        status = "Cabaço Intermediário";
      } else if (nivelCabaco > 30) {
        emoji = "😏💫";
        status = "Quase Lá";
      } else {
        emoji = "👀";
        status = "Iniciante";
      }
      
      lista += `${i + 1}️⃣ @${participant.id.split('@')[0]}\n`;
      lista += `   📊 *${nivelCabaco}% cabaço* ${emoji}\n`;
      lista += `   ⏰ *${tempoVirgem} anos* sem transar\n`;
      lista += `   🏷️ ${status}\n\n`;
    });

    const [maisCabaco, segundo, terceiro] = shuffled;

    lista += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `👑 *HALL DA VIRGINDADE* 👑\n\n`;
    lista += `🥇 @${maisCabaco.id.split('@')[0]}\n`;
    lista += `   *CABAÇO SUPREMO* 👶🍼\n\n`;
    lista += `🥈 @${segundo.id.split('@')[0]}\n`;
    lista += `   *VIRJÃO PROFISSIONAL* 🙈\n\n`;
    lista += `🥉 @${terceiro.id.split('@')[0]}\n`;
    lista += `   *MESTRE DA SOLIDÃO* 😢\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
