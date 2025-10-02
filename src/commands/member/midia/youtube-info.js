const { PREFIX } = require(`${BASE_DIR}/config`);
const yts = require("yt-search");

module.exports = {
  name: "info",
  description: "📊 Busca informações detalhadas de vídeos do YouTube",
  commands: ["info", "videoinfo", "ytinfo", "details", "informacoes"],
  usage: `${PREFIX}infoyt <nome do vídeo>`,

  handle: async function (data) {
    const {
      sendReply,
      args,
      userJid,
      sendImageFromURL,
      sendWaitReact,
      sendErrorReact,
      sendSuccessReact,
    } = data;

    if (!args.length) {
      return await sendReply(
        `📊 *VIDEO INFO - PESQUISADOR*\n\n` +
        `🔍 *Descrição:* Mostra informações detalhadas de vídeos do YouTube\n` +
        `⚡ *Velocidade:* Instantâneo (sem download)\n` +
        `📈 *Dados:* Título, canal, duração, visualizações, etc.\n\n` +
        `❌ *Uso incorreto!*\n` +
        `📝 *Como usar:*\n` +
        `${PREFIX}info <nome do vídeo>\n\n` +
        `💡 *Exemplos:*\n` +
        `${PREFIX}info Nirvana Come As You Are\n` +
        `${PREFIX}info tutorial JavaScript iniciante`,
        [userJid]
      );
    }

    const query = args.join(" ");

    try {
      await sendWaitReact();

      // Buscar vídeo no YouTube
      const searchResults = await yts(query);
      const video = searchResults.videos[0];
      
      if (!video) {
        await sendErrorReact();
        return await sendReply(
          `❌ *VÍDEO NÃO ENCONTRADO*\n\n` +
          `🔍 *Pesquisa:* "${query}"\n` +
          `💡 *Sugestões:*\n` +
          `• Verifique a ortografia\n` +
          `• Use palavras-chave diferentes\n` +
          `• Tente termos mais específicos\n` +
          `• Inclua o nome do canal ou artista`,
          [userJid]
        );
      }

      // Formatar números para melhor visualização
      const viewsFormatted = video.views ? 
        video.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "N/A";
      
      const uploadDate = video.uploadDate ? 
        new Date(video.uploadDate).toLocaleDateString('pt-BR') : "N/A";

      // Calcular engajamento aproximado
      let engagement = "N/A";
      if (video.views && video.views > 1000) {
        const likesEstimate = Math.floor(video.views * 0.04); // Estimativa de 4% de likes
        engagement = likesEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " 👍";
      }

      // Determinar categoria pelo título/descrição
      let category = "🎵 Música";
      const titleLower = video.title.toLowerCase();
      if (titleLower.includes("tutorial") || titleLower.includes("aula") || titleLower.includes("curso")) {
        category = "📚 Educativo";
      } else if (titleLower.includes("game") || titleLower.includes("jogo") || titleLower.includes("gameplay")) {
        category = "🎮 Games";
      } else if (titleLower.includes("receita") || titleLower.includes("culinária") || titleLower.includes("comida")) {
        category = "🍳 Culinária";
      } else if (titleLower.includes("notícia") || titleLower.includes("jornal") || titleLower.includes("política")) {
        category = "📰 Notícias";
      } else if (titleLower.includes("filme") || titleLower.includes("série") || titleLower.includes("cinema")) {
        category = "🎬 Entretenimento";
      }

      // Informações detalhadas do vídeo
      const infoMsg = 
        `📊 *INFORMAÇÕES DO VÍDEO*\n\n` +
        
        `📺 *DETALHES PRINCIPAIS*\n` +
        `📀 *Título:* ${video.title}\n` +
        `👤 *Canal:* ${video.author?.name || "Desconhecido"}\n` +
        `🏷️ *Categoria:* ${category}\n` +
        `⏱️ *Duração:* ${video.timestamp || "N/A"}\n\n` +
        
        `📈 *ESTATÍSTICAS*\n` +
        `👁️ *Visualizações:* ${viewsFormatted}\n` +
        `📅 *Publicado:* ${video.ago || "N/A"}\n` +
        `📆 *Data exata:* ${uploadDate}\n` +
        `💫 *Engajamento:* ${engagement}\n\n` +
        
        `🔗 *LINKS E METADADOS*\n` +
        `🆔 *Video ID:* ${video.videoId}\n` +
        `🌐 *URL:* ${video.url}\n` +
        `📺 *Canal URL:* ${video.author?.url || "N/A"}\n\n` +
        
        `💡 *AÇÕES DISPONÍVEIS*\n` +
        `🎵 *Baixar áudio:* ${PREFIX}play ${query}\n` +
        `🎬 *Baixar vídeo:* ${PREFIX}playvideo ${query}\n` +
        `🔍 *Nova busca:* ${PREFIX}ytinfo <outro vídeo>`;

      // Enviar thumbnail em alta qualidade
      const highQualityThumb = video.thumbnail.replace('hqdefault', 'maxresdefault');
      
      try {
        await sendImageFromURL(highQualityThumb, infoMsg, [userJid]);
      } catch (thumbError) {
        // Se a thumb de alta qualidade falhar, usar a padrão
        console.log("[INFO] Usando thumbnail padrão");
        await sendImageFromURL(video.thumbnail, infoMsg, [userJid]);
      }

      await sendSuccessReact();

    } catch (error) {
      console.error("[VIDEO INFO ERROR]", error);
      await sendErrorReact();
      
      let errorMsg = `❌ *ERRO NA PESQUISA*\n\n`;
      
      if (error.message.includes("network") || error.message.includes("connect")) {
        errorMsg += `🌐 *Problema de conexão*\nVerifique sua internet e tente novamente`;
      } else if (error.message.includes("timeout")) {
        errorMsg += `⏰ *Timeout da pesquisa*\nO YouTube está respondendo lentamente`;
      } else {
        errorMsg += `💻 *Erro técnico:* ${error.message}`;
      }
      
      errorMsg += `\n\n💡 *Tente novamente em alguns segundos*`;
      
      await sendReply(errorMsg, [userJid]);
    }
  },
};
