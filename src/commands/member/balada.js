const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "balada",
  description: "💃 Convida um amigo para uma balada épica!",
  commands: ["balada", "festa", "rolê", "night"],
  usage: `${PREFIX}balada @amigo`,

  handle: async function (data) {
    const {
      sendReply,
      webMessage,
      userJid,
      sendImageFromURL,
      sendWaitReact,
    } = data;

    const mencionado = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    if (!mencionado) {
      return await sendReply(
        `💃 *CONVITE PARA BALADA* 💃\n\n` +
        `❌ *Precisa marcar um amigo!*\n` +
        `${PREFIX}balada @amigo\n\n` +
        `🎯 *Vai rolar:*\n` +
        `• Música alta 🔊\n` +
        `• Drinks caros 🍹\n` +
        `• Pista lotada 🕺\n` +
        `• Ressaca garantida 😵`,
        [userJid]
      );
    }

    try {
      await sendWaitReact();

      const usuarioNumero = userJid.split('@')[0];
      const amigoNumero = mencionado.split('@')[0];

      const mensagem = 
        `🎉 *CONVITE VIP PARA BALADA* 🎉\n\n` +
        `@${usuarioNumero} está convidando @${amigoNumero} \n` +
        `para uma noite inesquecível! 🌙\n\n` +
        `🏢 *Local:* Club da Madrugada\n` +
        `🕘 *Horário:* 23:59 (até amanhecer)\n` +
        `🎵 *Atrações:* DJ Puta Que Pariu\n` +
        `🍻 *Open Bar:* Até a 3ª dose\n\n` +
        `💸 *Investimento:* R$ ${Math.floor(Math.random() * 100) + 50},00\n` +
        `📞 *Info:* (11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}\n\n` +
        `⚠️ *Regras:* \n` +
        `• Leve documento\n` +
        `• Chegue cedo\n` +
        `• Prepare o fígado!`;

      // Imagem de balada (substitua por uma URL de imagem de balada)
      const imagemBalada = "https://i.imgur.com/3mvE2Gt.jpeg"; // Usando a mesma imagem ou troque por outra

      await sendImageFromURL(imagemBalada, mensagem, [userJid, mencionado]);

    } catch (error) {
      console.error("[BALADA ERROR]", error);
      await sendReply(
        `❌ *BALADA CANCELADA!* ❌\n\n` +
        `😅 A balada foi fechada pela polícia!\n` +
        `🚓 Motivo: Muita zoeira!\n\n` +
        `💡 *Solução:* Marque outra hora!`,
        [userJid, mencionado]
      );
    }
  },
};
