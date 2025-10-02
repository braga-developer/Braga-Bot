const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "hehe",
  description: "😏 Rank dos que mais deram hehe no grupo!",
  commands: ["rank-hehe", "hehemetro", "quemdeumais", "transou"],
  usage: `${PREFIX}hehe`,

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
    lista += `   😏 *RANK QUEM DEU MAIS HEHE* 😏\n`;
    lista += `╰━─━─━─━─━─━─━─━─━─━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const vezes = Math.floor(Math.random() * 100) + 1;
      const emoji = vezes > 80 ? "🔥" : vezes > 50 ? "💦" : "😳";
      lista += `*${i + 1}.* @${participant.id.split('@')[0]} - *${vezes} vezes* ${emoji}\n`;
    });

    const campeao = shuffled[Math.floor(Math.random() * shuffled.length)];
    const experiencia = ["Iniciante", "Intermediário", "Avançado", "Profissional", "Lenda"][Math.floor(Math.random() * 5)];

    lista += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `👑 *Mestre do Hehe:* @${campeao.id.split('@')[0]} 🎯\n`;
    lista += `📊 *Nível:* ${experiencia} 🏆\n`;
    lista += `😏 *Status:* Ativo e dando hehe! 💕\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
