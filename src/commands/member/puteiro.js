const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "puteiro",
  description: "🎪 Leva um amigo para conhecer o puteiro mais famoso da cidade!",
  commands: ["puteiro", "prostibulo", "zona", "pulando", "pula"],
  usage: `${PREFIX}puteiro @amigo`,

  handle: async function (data) {
    const {
      sendReply,
      webMessage,
      userJid,
      sendWaitReact,
      sendSuccessReact,
    } = data;

    // Verificar se foi mencionado alguém - FORMATO CORRETO @lid
    const mencionado = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    if (!mencionado) {
      return await sendReply(
        `🎪 *COMANDO DO PUTEIRO* 🎪\n\n` +
        `❌ *Cadê o amigo?*\n` +
        `📝 *Como usar:*\n` +
        `${PREFIX}puteiro @amigo\n\n` +
        `💡 *Exemplo:*\n` +
        `${PREFIX}puteiro @5511999999999\n\n` +
        `🎯 *Efeitos:*\n` +
        `• Envia convite especial\n` +
        `• Lista de "atividades"\n` +
        `• Menciona o sortudo!\n` +
        `• Diversão garantida! 😂`,
        [userJid]
      );
    }

    try {
      await sendWaitReact();

      // FORMATO CORRETO - Extrair apenas o número para marcação
      const usuarioNumero = userJid.split('@')[0];
      const amigoNumero = mencionado.split('@')[0];

      // Lista de mensagens engraçadas
      const mensagens = [
        `🎪 *CONVITE PARA O PUTEIRO* 🎪\n\n@${usuarioNumero} está levando @${amigoNumero} para conhecer o *Puteiro do Zé*! 🍻\n\n🏆 *Estabelecimento 5 estrelas!* ⭐⭐⭐⭐⭐`,
        `🔥 *NOITE DE AVENTURA!* 🔥\n\n@${usuarioNumero} convidou @${amigoNumero} para uma noite inesquecível no *Cabaret do Chico*! 💃\n\n💸 *Promoção:* Primeira dose por conta da casa!`,
        `🎭 *PLANO PERFEITO!* 🎭\n\n@${usuarioNumero} está arrastando @${amigoNumero} para o famoso *Bordel da Dona Maria*! 🍾\n\n⚠️ *Aviso:* Vai sair caro!`,
        `💫 *PROGRAMAÇÃO VIP* 💫\n\n@${usuarioNumero} garantiu vaga no *Club dos Solteiros* para @${amigoNumero}! 🎯\n\n🚨 *Cuidado:* Não conte pra ninguém!`,
        `🍻 *ROLÊ DOS CAMPEÕES* 🍻\n\n@${usuarioNumero} está patrocinando a noite de @${amigoNumero} no *Puteiro do Bairro*! 💰\n\n🎊 *Inclui:* Open bar e open... outras coisas!`
      ];

      const mensagemEscolhida = mensagens[Math.floor(Math.random() * mensagens.length)];

      // Lista de "atividades" do puteiro
      const atividades = [
        "💃 Dança do poste",
        "🍺 Rodada de cerveja",
        "🎤 Karaokê desafinado", 
        "🕺 Passinho do malandro",
        "🎲 Jogo de sinuca",
        "📸 Foto com as " + (Math.random() > 0.5 ? "garotas" : "garotos"),
        "🍹 Drink especial da casa",
        "🎭 Teatro improvisado",
        "💋 Beijo grego (mentira)",
        "💰 Caça-níquel quebrado",
        "🎯 Tiro ao alvo (de tequila)",
        "🃏 Jogo de truco proibido",
        "💄 Maquiagem grátis",
        "👖 Concurso de calça justa",
        "🎵 Batalha de passinho"
      ];

      // Selecionar 4 atividades aleatórias
      const atividadesSelecionadas = [];
      while (atividadesSelecionadas.length < 4) {
        const atividade = atividades[Math.floor(Math.random() * atividades.length)];
        if (!atividadesSelecionadas.includes(atividade)) {
          atividadesSelecionadas.push(atividade);
        }
      }

      // Mensagem completa
      const mensagemCompleta = 
        `${mensagemEscolhida}\n\n` +
        `📋 *ATIVIDADES INCLUSAS:*\n` +
        `${atividadesSelecionadas.map((atv, index) => `${index + 1}️⃣ ${atv}`).join('\n')}\n\n` +
        `💰 *INVESTIMENTO:*\n` +
        `💸 Entrada: R$ ${Math.floor(Math.random() * 50) + 20},00\n` +
        `🍻 Consumo: A partir de R$ ${Math.floor(Math.random() * 100) + 50},00\n` +
        `💳 Formas de pagamento: Dinheiro, PIX ou fiado\n\n` +
        `🕒 *HORÁRIO DE FUNCIONAMENTO:*\n` +
        `⏰ 20:00 às 05:00 (De terça a domingo)\n` +
        `🚫 Fechado às segundas (para limpeza)\n\n` +
        `📞 *RESERVAS:*\n` +
        `📱 (11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}\n\n` +
        `🎊 *CLASSIFICAÇÃO:* ${Math.floor(Math.random() * 3) + 3} estrelas\n` +
        `⚠️ *AVISO:* Leve dinheiro trocado!\n\n` +
        `📍 *Localização:* Rua da Alegria, 69 - Centro`;

      // Enviar a mensagem marcando ambos - FORMATO CORRETO @lid
      await sendReply(mensagemCompleta, [userJid, mencionado]);
      await sendSuccessReact();

      // Enviar uma mensagem de follow-up engraçada
      setTimeout(async () => {
        const followUps = [
          `🎯 *LEMBRETE IMPORTANTE:*\nNão esquece a identidade, @${amigoNumero}! Vão pedir na porta! 🆔`,
          `💡 *DICA DO EXPERIENTE:*\nLeva camisinha, @${amigoNumero}! Melhor prevenir que remediar! 🎈`, 
          `🚨 *ALERTA DE SEGURANÇA:*\nEsconde a carteira, @${amigoNumero}! Lá é cada um por si! 💰`,
          `🍻 *DICA DE SOBREVIVÊNCIA:*\nNão aceita drinks de estranhos, @${amigoNumero}! 💀`,
          `📱 *RECOMENDAÇÃO:*\nDeixa o celular com 100% de bateria, @${amigoNumero}! Vai precisar! 🔋`,
          `👖 *DICA DE MODA:*\nVai de calça jeans, @${amigoNumero}! É mais seguro! 👖`,
          `🚗 *PLANO DE FUGA:*\nCombina um sinal com @${usuarioNumero} pra sair correndo se der ruim! 🏃‍♂️`
        ];
        
        await sendReply(followUps[Math.floor(Math.random() * followUps.length)], [userJid, mencionado]);
      }, 2000);

    } catch (error) {
      console.error("[PUTEIRO ERROR]", error);
      
      // Mensagem de erro engraçada
      const usuarioNumero = userJid.split('@')[0];
      const amigoNumero = mencionado ? mencionado.split('@')[0] : "amigo";
      
      await sendReply(
        `❌ *PUTEIRO FECHADO!* ❌\n\n` +
        `😅 Aparentemente o puteiro está em reforma!\n` +
        `🔧 Tente novamente mais tarde, @${amigoNumero}...\n\n` +
        `💡 *Dica:* Enquanto isso, toma uma cerveja com @${usuarioNumero}! 🍻\n` +
        `🏠 *Alternativa:* Vamos de Netflix e chill? 📺`,
        mencionado ? [userJid, mencionado] : [userJid]
      );
    }
  },
};
