// gerarqrcode.js - CORRIGIDO (usando FFmpeg se necessário)
const qrcode = require('qrcode');
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "gerarqrcode",
  description: "🔳 Transformo qualquer textinho em QR Code mágico! ✨",
  commands: ["gerarqrcode", "qrcode", "qr", "criarqr", "qrmagico"],
  usage: `${PREFIX}gerarqrcode <texto> - Pra quando copiar e colar é muito mainstream 😎`,
  
  handle: async ({ args, sendReply, sendErrorReply, sendImageFromBuffer }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "🤨 *E o texto, cadê?* \n" +
        "Acha que QR Code nasce de ar puro? \n\n" +
        "Me diz o que você quer transformar nessa belezura digital! 📝"
      );
    }

    const text = args.join(" ");
    
    // Verifica se o texto não é muito curto (opcional)
    if (text.length < 2) {
      throw new InvalidParameterError(
        "💀 *Sério? Só isso?* \n\n" +
        "Coloca pelo menos 2 caracteres, vai! \n" +
        "Até 'oi' já serve! 👋"
      );
    }

    // Verifica se não é muito longo (pra evitar abusos)
    if (text.length > 1000) {
      throw new InvalidParameterError(
        "📖 *Nossa, tá escrevendo um livro?* \n\n" +
        "Resumê aí, chefia! \n" +
        "*No máximo 1000 caracteres!* 😅"
      );
    }
    
    try {
      await sendReply("*⚡ Gerando seu QR Code...* \nUm segundinho que a mágica tá sendo feita! 🪄");

      // Usando a biblioteca qrcode que é mais eficiente para QR Codes
      const qrBuffer = await qrcode.toBuffer(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const truncatedText = text.length > 50 ? text.substring(0, 50) + '...' : text;
      
      await sendImageFromBuffer(qrBuffer, 
        "✅ *QR Code Gerado com Sucesso!* \n\n" +
        `🔤 *Texto:* ${truncatedText}\n` +
        `📏 *Tamanho:* ${text.length} caracteres\n` +
        "💫 *Agora é só escanear e ser feliz!* \n\n" +
        "_Dica: Se não funcionar, a culpa é da câmera do seu celular! 📱😜_"
      );
      
    } catch (error) {
      await sendErrorReply(
        "💥 *Ih, deu ruim!* \n\n" +
        "O gerador de QR Codes pirou! 🥴 \n\n" +
        "Tenta de novo aí, vai que cola! 🍀\n" +
        `_Erro técnico: ${error.message}_`
      );
    }
  },
};
