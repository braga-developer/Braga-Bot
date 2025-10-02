const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "azar",
  description: "🍀 Rank dos mais azarados do grupo!",
  commands: ["rank-azar", "azarmetro", "azarado"],
  usage: `${PREFIX}azar`,

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
    lista += `      🍀 *RANK AZAR* 🍀\n`;
    lista += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const azar = Math.floor(Math.random() * 100) + 1;
      const acidentes = Math.floor(Math.random() * 50) + 1;
      
      let emoji, frase;
      if (azar > 90) {
        emoji = "💀🎯";
        frase = "Atrai azar até pela respiração";
      } else if (azar > 70) {
        emoji = "😱⚡";
        frase = "Gato preto foge dele";
      } else if (azar > 50) {
        emoji = "🙈✨";
        frase = "Tem seus momentos";
      } else {
        emoji = "😇";
        frase = "Sortudo disfarçado";
      }
      
      lista += `*${i + 1}.* @${participant.id.split('@')[0]}\n`;
      lista += `   📉 *${azar}%* de azar ${emoji}\n`;
      lista += `   🚨 ${acidentes} acidentes cômicos\n`;
      lista += `   💬 "${frase}"\n\n`;
    });

    const [azarado] = shuffled;

    lista += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `🎯 *REI DO AZAR* 🎯\n\n`;
    lista += `@${azarado.id.split('@')[0]} 👑\n`;
    lista += `*Até a sorte tem medo dele!* 💀🍀\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
