const { PREFIX } = require(`${BASE_DIR}/config`);
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

module.exports = {
  name: "playvideo",
  description: "🎬 Busca e baixa vídeos do YouTube em alta qualidade",
  commands: ["playvideo", "video", "ytmp4", "playv", "ytvideo"],
  usage: `${PREFIX}playvideo <nome do vídeo>`,

  handle: async function (data) {
    const {
      sendReply,
      args,
      userJid,
      message,
      sendVideoFromFile,
      sendImageFromURL,
      sendWaitReact,
      sendErrorReact,
      sendSuccessReact,
    } = data;

    if (!args.length) {
      return await sendReply(
        `🎬 *PLAY VIDEO - DOWNLOADER*\n\n` +
        `📹 *Descrição:* Baixa vídeos do YouTube em qualidade HD\n` +
        `🎯 *Qualidade:* Melhor disponível (até 1080p)\n` +
        `⏱️ *Limite:* 10 minutos\n` +
        `💾 *Formato:* MP4\n\n` +
        `❌ *Uso incorreto!*\n` +
        `📝 *Como usar:*\n` +
        `${PREFIX}playvideo <nome do vídeo>\n\n` +
        `💡 *Exemplos:*\n` +
        `${PREFIX}playvideo tutorial JavaScript\n` +
        `${PREFIX}playvideo Como tirar notas boas sendo burro\n` +
        `${PREFIX}playvideo unboxing iPhone 15`,
        [userJid]
      );
    }

    const query = args.join(" ");
    const tempDir = path.join(BASE_DIR, "assets", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
      await sendWaitReact();

      // Buscar vídeo no YouTube
      const searchResults = await yts(query);
      const video = searchResults.videos[0];
      if (!video) {
        await sendErrorReact();
        return await sendReply(
          `❌ *VÍDEO NÃO ENCONTRADO*\n\n` +
          `🔍 *Pesquisa:* ${query}\n` +
          `💡 *Dicas:*\n` +
          `• Verifique a ortografia\n` +
          `• Use palavras-chave mais específicas\n` +
          `• Tente incluir o nome do canal`,
          [userJid]
        );
      }

      // Validar duração (máximo 10 minutos)
      const duration = video.seconds || 0;
      if (duration > 600) {
        await sendErrorReact();
        return await sendReply(
          `⏰ *VÍDEO MUITO LONGO*\n\n` +
          `📀 *Título:* ${video.title}\n` +
          `⏱️ *Duração:* ${video.timestamp}\n` +
          `🚫 *Limite:* 10 minutos\n` +
          `💡 *Dica:* Escolha vídeos mais curtos para melhor performance`,
          [userJid]
        );
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      const timestamp = Date.now();
      const outputFile = path.join(tempDir, `video_${timestamp}.mp4`);

      // Baixar vídeo na melhor qualidade disponível
      const ytDlpCommand = [
        "yt-dlp",
        "-f", "best[height<=1080]", // melhor qualidade até 1080p
        "--merge-output-format", "mp4",
        "--add-metadata",
        "-o", outputFile,
        videoUrl,
      ];

      await new Promise((resolve, reject) => {
        const proc = spawn(ytDlpCommand[0], ytDlpCommand.slice(1));
        let output = "";

        const timeout = setTimeout(() => {
          proc.kill();
          reject(new Error("⏰ Timeout - Download muito lento"));
        }, 300000); // 5 minutos

        proc.stderr.on("data", (data) => { output += data.toString(); });
        proc.stdout.on("data", (data) => { output += data.toString(); });
        
        proc.on("close", (code) => {
          clearTimeout(timeout);
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`❌ Falha no download: ${output || code}`));
          }
        });
        
        proc.on("error", (err) => reject(new Error(`💻 Erro de execução: ${err.message}`)));
      });

      if (!fs.existsSync(outputFile) || fs.statSync(outputFile).size < 102400) {
        throw new Error("🎬 Arquivo de vídeo inválido ou muito pequeno");
      }

      // Informações detalhadas do vídeo
      const fileSize = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2);
      const viewsFormatted = video.views ? 
        video.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "N/A";

      // Detectar qualidade do vídeo
      let qualityInfo = "HD";
      if (videoUrl.includes("1080")) qualityInfo = "Full HD (1080p)";
      else if (videoUrl.includes("720")) qualityInfo = "HD (720p)";
      else if (videoUrl.includes("480")) qualityInfo = "SD (480p)";

      const infoMsg = 
        `🎬 *VÍDEO BAIXADO!*\n\n` +
        `📀 *Título:* ${video.title}\n` +
        `👤 *Canal:* ${video.author?.name || "Desconhecido"}\n` +
        `⏱️ *Duração:* ${video.timestamp || "N/A"}\n` +
        `👁️ *Visualizações:* ${viewsFormatted}\n` +
        `📅 *Publicado:* ${video.ago || "N/A"}\n` +
        `💾 *Tamanho:* ${fileSize}MB\n` +
        `🎯 *Qualidade:* ${qualityInfo}\n` +
        `📺 *Resolução:* Até 1080p\n` +
        `🔗 *URL:* ${video.url}`;

      // Enviar thumbnail com informações
      await sendImageFromURL(video.thumbnail, infoMsg, [userJid], message);
      
      // Enviar vídeo
      await sendVideoFromFile(outputFile, `📹 ${video.title}`, [userJid], message);
      await sendSuccessReact();

      // Limpeza após 60 segundos
      setTimeout(() => {
        try {
          if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
            console.log(`[VIDEO CLEANUP] Arquivo removido: ${outputFile}`);
          }
        } catch (cleanupError) {
          console.error("[VIDEO CLEANUP ERROR]", cleanupError);
        }
      }, 60000);

    } catch (error) {
      console.error("[PLAY VIDEO ERROR]", error);
      await sendErrorReact();
      
      let errorMsg = `❌ *ERRO NO DOWNLOAD*\n\n`;
      
      if (error.message.includes("Timeout")) {
        errorMsg += `⏰ *Timeout excedido*\nO vídeo é muito longo ou a conexão está lenta`;
      } else if (error.message.includes("unavailable")) {
        errorMsg += `🚫 *Conteúdo indisponível*\nO vídeo pode ter sido removido ou tem restrições`;
      } else if (error.message.includes("small")) {
        errorMsg += `📦 *Arquivo corrompido*\nO download não foi completado corretamente`;
      } else {
        errorMsg += `💻 *Erro técnico:* ${error.message}`;
      }
      
      errorMsg += `\n\n💡 *Tente um vídeo mais curto ou verifique sua conexão*`;
      
      await sendReply(errorMsg, [userJid]);
    }
  },
};
