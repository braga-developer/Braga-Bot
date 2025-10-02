const { PREFIX } = require(`${BASE_DIR}/config`);
const axios = require("axios");
const translate = require("@vitalets/google-translate-api");

module.exports = {
  name: "anime",
  description: "🎌 Busca info de animes (pra quem vive no mundo 2D)",
  commands: ["anime", "animeinfo", "otaku"],
  usage: `${PREFIX}anime <nome do anime> - Descubra se vale a pena assistir 😏`,
  
  handle: async ({ sendReply, sendReact, sendErrorReply, sendImageFromURL, args }) => {
    await sendReact("🎌");

    if (!args || args.length === 0) {
      return sendErrorReply("🤨 Cadê o nome do anime? Tá difícil escrever?\nEx: */anime Naruto*");
    }

    const animeName = args.join(" ");

    try {
      const response = await axios.get(
        `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(animeName)}&page[limit]=5`
      );

      if (!response.data.data || response.data.data.length === 0) {
        return sendErrorReply("❌ Anime não encontrado! \nOu você digitou errado, ou esse anime é muito nicho 🤷‍♂️");
      }

      let index = 1;
      for (const animeData of response.data.data) {
        const anime = animeData.attributes;

        let synopsis = anime.synopsis || "Sem sinopse... deve ser bem ruinzinho 😅";
        try {
          const translation = await translate(synopsis, { to: "pt" });
          synopsis = translation.text;
        } catch {}

        const statusMap = {
          finished: "✅ Finalizado",
          current: "📺 Em exibição", 
          upcoming: "⏳ Em breve",
          tba: "🤷 A ser anunciado",
        };
        const statusPT = statusMap[anime.status] || anime.status;

        const typeMap = {
          ONA: "🌐 ONA (Web)",
          OVA: "💿 OVA", 
          TV: "📺 Série de TV",
          movie: "🎬 Filme",
          music: "🎵 Música",
          special: "🎊 Especial",
        };
        const tipoPT = typeMap[anime.showType] || anime.showType;

        let genres = "Desconhecido";
        try {
          const genresRes = await axios.get(`https://kitsu.io/api/edge/anime/${animeData.id}/categories`);
          genres = genresRes.data.data.map(g => g.attributes.title).join(", ") || "Sem gênero definido";
        } catch {
          genres = "Sem gênero definido";
        }

        const trailer = anime.youtubeVideoId
          ? `https://www.youtube.com/watch?v=${anime.youtubeVideoId}`
          : "Nenhum 😢";

        const message = `
*${index}. ${anime.canonicalTitle}*

🇯🇵 *JP:* ${anime.titles?.ja_jp || "N/A"}
🌎 *EN:* ${anime.titles?.en || "N/A"}

📺 *Tipo:* ${tipoPT}
📅 *Ano:* ${anime.startDate ? anime.startDate.split("-")[0] : "N/A"}
⭐ *Nota:* ${anime.averageRating || "N/A"}
📊 *Popularidade:* #${anime.popularityRank || "N/A"}
🏆 *Ranking:* #${anime.ratingRank || "N/A"}
⏱️ *Duração:* ${anime.episodeLength ? anime.episodeLength + " min" : "N/A"}
📺 *Episódios:* ${anime.episodeCount || "❓"}
📡 *Status:* ${statusPT}
🎨 *Gêneros:* ${genres}
🔞 *Classificação:* ${anime.ageRating || "Livre"} (${anime.ageRatingGuide || "pra geral"})
🎬 *Trailer:* ${trailer}

*📖 Sinopse:*
${synopsis.substring(0, 600)}...
        `;

        await sendReply(message.trim());

        if (index <= 2 && anime.posterImage?.original) {
          await sendImageFromURL(anime.posterImage.original, `🖼️ Poster: ${anime.canonicalTitle}`);
        }

        if (index === 1 && anime.coverImage?.original) {
          await sendImageFromURL(anime.coverImage.original, `🎴 Capa: ${anime.canonicalTitle}`);
        }

        index++;
      }
    } catch (error) {
      console.error(error);
      await sendErrorReply("💥 Deu ruim! API tá de greve ou sua internet é ruim 🤷‍♂️");
    }
  },
};
