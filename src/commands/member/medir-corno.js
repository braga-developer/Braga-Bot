const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "medir-corno",
  description: "🐂 Mede o nível de *cornice* de alguém",
  commands: ["medir-corno", "cornometro"],
  usage: `${PREFIX}medir-corno @alguém`,

  handle: async ({ webMessage, sendReply, args }) => {
    const mencionado = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    let alvo, alvoId;
    if (mencionado) {
      alvo = `@${mencionado.split('@')[0]}`;
      alvoId = mencionado;
    } else if (args[0] && args[0].includes('@')) {
      alvo = args[0];
      alvoId = args[0] + (args[0].includes('.') ? '' : '@s.whatsapp.net');
    } else {
      alvo = "Você mesmo";
      alvoId = null;
    }

    const nivel = Math.floor(Math.random() * 101);
    
    let mensagem = `🐂 *CORNÔMETRO™* 🐂\n\n👤 Alvo: ${alvo}\n📊 Nível de corno: *${nivel}%*\n\n`;
    
    if (nivel < 20) {
      mensagem += "✅ *Salvo!* - Quase um santo 👼";
    } else if (nivel < 50) {
      mensagem += "⚠️ *Cuidado!* - Tá de olho... 👀";
    } else if (nivel < 80) {
      mensagem += "🚨 *Perigo!* - Já sente o cheiro do chifre 🐮";
    } else {
      mensagem += "🔥 *EM CHAMAS!* - Chifre detectado em 4K! 📸😂";
    }

    await sendReply(mensagem, alvoId ? [alvoId] : []);
  },
};
