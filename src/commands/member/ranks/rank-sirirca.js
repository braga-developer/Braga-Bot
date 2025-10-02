const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "siririca",
  description: "💅 Rank das siririqueiras oficiais do grupo!",
  commands: ["rank-siririca", "siririqueira", "mulher"],
  usage: `${PREFIX}siririca`,

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
    lista += `   💅 *RANK SIRIRICA* 💅\n`;
    lista += `╰━─━─━─━─━─━─━─━─━─━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const vezes = Math.floor(Math.random() * 150) + 1;
      const nivel = vezes > 100 ? "Expert" : vezes > 50 ? "Intermediária" : "Iniciante";
      const emoji = vezes > 100 ? "💦" : vezes > 50 ? "✨" : "🌸";
      lista += `*${i + 1}.* @${participant.id.split('@')[0]} - *${vezes}x* (${nivel}) ${emoji}\n`;
    });

    const rainha = shuffled[Math.floor(Math.random() * shuffled.length)];

    lista += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `👑 *Rainha da Siririca:* @${rainha.id.split('@')[0]} 💕\n`;
    lista += `🎀 *Título:* Dama do Prazer Solo 👑\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
