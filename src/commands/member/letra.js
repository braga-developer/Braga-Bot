const { PREFIX } = require(`${process.cwd()}/src/config`);
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const Genius = require("genius-lyrics");
const lyricsFinder = require("lyrics-finder");

const GeniusClient = new Genius.Client("oN6DOt9JLbffh1C85RbeezCUUD5R1k681C2B3A9yt3c2bJQRgRewnJ1knry1whO5"); // Substitua pelo seu token

module.exports = {
  name: "letra",
  description: "Busca a letra da música e envia thumbnail + infos. Fallback: envia áudio se letra não encontrada",
  commands: ["letra", "lyrics", "songtext"],
  usage: `${PREFIX}letra <nome da música>`,

  handle: async function (data) {
    const {
      sendReply,
      args,
      userJid,
      message,
      sendImageFromURL,
      sendAudioFromFile,
      sendWaitReact,
      sendErrorReact,
      sendSuccessReact,
    } = data;

    if (!args.length) {
      return await sendReply(
        `🎵 *LETRA COMMAND*
❌ *Uso incorreto!*
📝 *Como usar:*
${PREFIX}letra <nome da música>
💡 *Exemplo:*
${PREFIX}letra Fragmentos da alma
${PREFIX}letra Devorador de As`,
        [userJid]
      );
    }

    const query = args.join(" ");
    const tempDir = path.join(process.cwd(), "assets", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
      if (sendWaitReact) await sendWaitReact();

      let lyrics = null;
      let foundMethod = null;

      // 1️⃣ Genius API
      try {
        const searches = await GeniusClient.songs.search(query);
        if (searches.length > 0) {
          const song = searches[0];
          lyrics = await song.lyrics();
          foundMethod = "Genius";
        }
      } catch (err) {
        console.error("[LETRA GENIUS ERROR]", err);
      }

      // 2️⃣ lyrics-finder fallback
      if (!lyrics) {
        try {
          lyrics = (await lyricsFinder(null, query)) || null;
          if (lyrics) foundMethod = "lyrics-finder";
        } catch (err) {
          console.error("[LETRA LYRICS-FINDER ERROR]", err);
        }
      }

      // 3️⃣ Buscar vídeo do YouTube
      const searchResults = await yts(query);
      const video = searchResults.videos[0];

      if (!video) {
        if (sendErrorReact) await sendErrorReact();
        return await sendReply(
          `❌ *MÚSICA NÃO ENCONTRADA NO YOUTUBE*
🔍 *Pesquisa:* ${query}`,
          [userJid]
        );
      }

      const infoMsg = `
🎧 *MÚSICA ENCONTRADA!*
📀 *Título:* ${video.title}
👤 *Canal:* ${video.author?.name || "Desconhecido"}
⏱️ *Duração:* ${video.duration?.timestamp || "Desconhecido"}
👁️ *Visualizações:* ${video.views || "N/A"}
      `.trim();

      await sendImageFromURL(video.thumbnail, infoMsg, [userJid], message);

      // 4️⃣ Se letra encontrada, envia em uma única mensagem
      if (lyrics) {
        await sendReply(`🎶 *LETRA ENCONTRADA (${foundMethod})*\n\n${lyrics}`, [userJid]);
        if (sendSuccessReact) await sendSuccessReact();
        return;
      }

      // 5️⃣ Fallback: baixar áudio e informar que letra não foi encontrada
      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      const timestamp = Date.now();
      const outputFile = path.join(tempDir, `audio_${timestamp}.mp3`);

      const ytDlpCommand = [
        "yt-dlp",
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "128K",
        "--no-playlist",
        "--format",
        "bestaudio",
        "--extract-audio",
        "--embed-thumbnail",
        "--add-metadata",
        "--no-warnings",
        "--quiet",
        "-o",
        outputFile,
        videoUrl,
      ];

      await new Promise((resolve, reject) => {
        const proc = spawn(ytDlpCommand[0], ytDlpCommand.slice(1));
        let errorOutput = "";

        const timeout = setTimeout(() => {
          proc.kill();
          reject(new Error("Timeout - Música muito longa"));
        }, 40000);

        proc.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        proc.on("close", (code) => {
          clearTimeout(timeout);
          code === 0
            ? resolve()
            : reject(new Error(`yt-dlp falhou: ${errorOutput || "Código " + code}`));
        });

        proc.on("error", (error) => {
          reject(new Error(`Erro ao executar yt-dlp: ${error.message}`));
        });
      });

      if (!fs.existsSync(outputFile) || fs.statSync(outputFile).size < 10000) {
        throw new Error("Arquivo de áudio inválido");
      }

      // Enviar áudio
      await sendAudioFromFile(outputFile, false, message);

      await sendReply(
        `⚠️ *LETRA NÃO ENCONTRADA*\nO áudio da música foi enviado como fallback.`,
        [userJid]
      );
      if (sendErrorReact) await sendErrorReact();

      // Limpeza do arquivo
      setTimeout(() => {
        if (fs.existsSync(outputFile)) {
          try { fs.unlinkSync(outputFile); } catch {}
        }
      }, 5000);

    } catch (error) {
      console.error("[LETRA COMMAND ERROR]", error);
      if (sendErrorReact) await sendErrorReact();
      await sendReply(
        `❌ *ERRO AO BUSCAR LETRA OU BAIXAR MÚSICA*`,
        [userJid]
      );
    }
  },
};
