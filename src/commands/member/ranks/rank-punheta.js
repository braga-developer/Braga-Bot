const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "punheteiro",
  description: "🔞 Lista oficial dos punheteiros/siriqueiras do grupo!",
  commands: ["rank-jabateu", "siriqueira", "punhetometro"],
  usage: `${PREFIX}punheteiro`,

  handle: async ({ sendText, getGroupMetadata, chatId, isGroup }) => {
    if (!isGroup) {
      throw new InvalidParameterError("❌ Esse comando só pode ser usado em grupos.");
    }

    const groupMetadata = await getGroupMetadata(chatId);
    const participants = groupMetadata.participants;

    if (!participants.length) {
      throw new InvalidParameterError("❌ Nenhum membro encontrado.");
    }

    const shuffled = participants.sort(() => Math.random() - 0.5);

    let lista = `╭━─━─━─━─━─━─━─━─━─━╮\n`;
    lista += `   🔞 *PUNHETÔMETRO OFICIAL* 🔞\n`;
    lista += `╰━─━─━─━─━─━─━─━─━─━╯\n\n`;

    shuffled.forEach((participant, i) => {
      const vezes = Math.floor(Math.random() * 100) + 1;
      lista += `*${i + 1}.* @${participant.id.split('@')[0]}  — já bateu *${vezes}x* 🖐️💦\n`;
    });

    const escolhido = shuffled[Math.floor(Math.random() * shuffled.length)];
    lista += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    lista += `👑 O *Mestre Punheteiro / Siriqueira Suprema* é: @${escolhido.id.split('@')[0]}!!! 💦🔥\n`;
    lista += `━━━━━━━━━━━━━━━━━━━━━━`;

    await sendText(lista, shuffled.map(p => p.id));
  },
};
