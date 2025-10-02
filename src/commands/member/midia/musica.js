const { PREFIX } = require(`${process.cwd()}/src/config`);
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

module.exports = {
  name: "play",
  description: "Busca e baixa vídeos do YouTube e converte para MP3 usando FFmpeg",
  commands: ["play", "music", "ytmp3", "playaudio"],
  usage: `${PREFIX}play <nome da música>`,

  handle: async function (data) {
    const {
      sendReply,
      args,
      userJid,
      message,
      sendAudioFromFile,
      sendImageFromURL,
      sendWaitReact,
      sendErrorReact,
      sendSuccessReact,
    } = data;

    if (!args.length) {
      return await sendReply(
        `🎵 *PLAY MUSIC COMMAND*
❌ *Uso incorreto!*
📝 *Como usar:*
${PREFIX}play <nome da música>
💡 *Exemplo:*
${PREFIX}play Nirvana Come As You Are`,
        [userJid]
      );
    }

    const query = args.join(" ");
    const tempDir = path.join(process.cwd(), "assets", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
      if (sendWaitReact) await sendWaitReact();

      // Buscar vídeo no YouTube
      const searchResults = await yts(query);
      const video = searchResults.videos[0];
      if (!video) {
        if (sendErrorReact) await sendErrorReact();
        return await sendReply(`❌ *MÚSICA NÃO ENCONTRADA*\n🔍 Pesquisa: ${query}`, [userJid]);
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      const timestamp = Date.now();
      const videoFile = path.join(tempDir, `video_${timestamp}.mp4`);
      const audioFile = path.join(tempDir, `audio_${timestamp}.mp3`);

      // Baixar vídeo em MP4 (igual ao playvideo)
      const ytDlpCommand = [
        "yt-dlp",
        "-f", "mp4",
        "-o", videoFile,
        videoUrl,
      ];

      await new Promise((resolve, reject) => {
        const proc = spawn(ytDlpCommand[0], ytDlpCommand.slice(1));
        let errorOutput = "";

        const timeout = setTimeout(() => {
          proc.kill();
          reject(new Error("Timeout - download do vídeo muito lento"));
        }, 300000); // até 5 minutos

        proc.stderr.on("data", (data) => { errorOutput += data.toString(); });
        proc.on("close", (code) => {
          clearTimeout(timeout);
          code === 0 ? resolve() : reject(new Error(`yt-dlp falhou: ${errorOutput || code}`));
        });
        proc.on("error", (err) => reject(new Error(`Erro ao executar yt-dlp: ${err.message}`)));
      });

      // Verificar se o vídeo foi baixado corretamente
      if (!fs.existsSync(videoFile) || fs.statSync(videoFile).size < 10000) {
        throw new Error("Arquivo de vídeo inválido ou muito pequeno");
      }

      // Converter vídeo para MP3 usando FFmpeg
      await new Promise((resolve, reject) => {
        const ffmpegCommand = [
          "ffmpeg",
          "-i", videoFile,
          "-vn", // remove vídeo
          "-acodec", "libmp3lame",
          "-ab", "192k", // bitrate de áudio
          "-ar", "44100", // sample rate
          "-y", // sobrescrever arquivo existente
          audioFile
        ];

        const proc = spawn(ffmpegCommand[0], ffmpegCommand.slice(1));
        let errorOutput = "";

        const timeout = setTimeout(() => {
          proc.kill();
          reject(new Error("Timeout - conversão FFmpeg muito lenta"));
        }, 120000); // até 2 minutos para conversão

        proc.stderr.on("data", (data) => { errorOutput += data.toString(); });
        proc.on("close", (code) => {
          clearTimeout(timeout);
          code === 0 ? resolve() : reject(new Error(`FFmpeg falhou: ${errorOutput || code}`));
        });
        proc.on("error", (err) => reject(new Error(`Erro ao executar FFmpeg: ${err.message}`)));
      });

      // Verificar se o áudio foi convertido corretamente
      if (!fs.existsSync(audioFile) || fs.statSync(audioFile).size < 10000) {
        throw new Error("Arquivo de áudio inválido ou muito pequeno");
      }

      // Informações da música
      const infoMsg = `
🎵 *MÚSICA ENCONTRADA!*
🎶 *Título:* ${video.title}
👤 *Artista/Canal:* ${video.author?.name || "Desconhecido"}
⏱️ *Duração:* ${video.duration?.timestamp || "Desconhecido"}
👁️ *Visualizações:* ${video.views || "N/A"}
🔧 *Conversão:* FFmpeg
      `.trim();

      // Enviar thumbnail com informações
      await sendImageFromURL(video.thumbnail, infoMsg, [userJid], message);
      
      // ✅ CORREÇÃO: Enviar áudio como arquivo normal (não como voz)
      // asVoice: false para permitir reprodução normal
      await sendAudioFromFile(audioFile, false, message);

      if (sendSuccessReact) await sendSuccessReact();

      // Limpeza dos arquivos temporários após 30 segundos
      setTimeout(() => {
        try {
          if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
          if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
          console.log(`[CLEANUP] Arquivos temporários removidos: ${audioFile}`);
        } catch (cleanupError) {
          console.error("[CLEANUP ERROR]", cleanupError);
        }
      }, 30000); // 30 segundos para garantir o download

    } catch (error) {
      console.error("[PLAY MUSIC ERROR]", error);
      if (sendErrorReact) await sendErrorReact();
      await sendReply(`❌ *ERRO NO DOWNLOAD/CONVERSÃO*\n${error.message}`, [userJid]);
    }
  },
};
    
