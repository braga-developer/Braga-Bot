const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { downloadContentFromMessage, getBuffer } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "ig",
  description: "🕵️‍♂️ Detective virtual do Instagram - investigação completa e profunda! 🔍",
  commands: ["ig", "instagram", "perfilig", "insta", "stalkear", "investigar"],
  usage: `${PREFIX}ig <@usuario> - Revelo TUDO sobre qualquer perfil! 🎯`,

  handle: async ({ args, sendReply, sendErrorReply, sendImageFromBuffer }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "🤨 Cadê o @ do usuário? \n\n" +
        "Me diz qual perfil você quer investigar! \n" +
        "Exemplo: */ig @nomedousuario*"
      );
    }

    let username = args[0].replace("@", "").toLowerCase();

    if (username.length < 1 || username.length > 30) {
      throw new InvalidParameterError(
        "❌ Username inválido! \n" +
        "O @ deve ter entre 1 e 30 caracteres! 📏"
      );
    }

    try {
      await sendReply("🔍 *Iniciando investigação profunda...* \n🕵️‍♂️ Coletando dados secretos do Instagram...");

      const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Instagram 219.0.0.12.117 Android",
          "X-IG-App-ID": "1217981644879628",
          "X-IG-WWW-Claim": "0",
          "X-Requested-With": "XMLHttpRequest",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept": "application/json",
          "Connection": "close",
          "Origin": "https://www.instagram.com",
          "Referer": "https://www.instagram.com/",
          "Authority": "www.instagram.com"
        },
        timeout: 20000
      });

      const user = response.data?.data?.user;

      if (!user) {
        return await sendErrorReply(
          "❌ Perfil não encontrado! \n\n" +
          "Possíveis motivos: \n" +
          "✏️ O @ tá errado\n" +
          "🔒 Perfil é privado\n" + 
          "👻 Usuário não existe\n" +
          "🤷‍♂️ Instagram tá de birra"
        );
      }

      // 🔍 DETALHES DA IMAGEM DE PERFIL
      let profilePicBuffer = null;
      let profilePicUrl = user.profile_pic_url_hd || user.profile_pic_url;
      let profilePicInfo = "";
      
      try {
        const imageResponse = await axios.get(profilePicUrl, {
          responseType: 'arraybuffer',
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        profilePicBuffer = Buffer.from(imageResponse.data);
        
        // Analisar a URL da imagem para extrair informações
        if (profilePicUrl.includes('scontent')) {
          const picSize = imageResponse.data.length;
          const sizeKB = (picSize / 1024).toFixed(1);
          profilePicInfo = `📸 HD (${sizeKB}KB)`;
        } else {
          profilePicInfo = "📸 Qualidade padrão";
        }
      } catch (imgError) {
        console.error("Erro ao baixar imagem:", imgError.message);
        profilePicInfo = "❌ Imagem não disponível";
      }

      // 📊 ANÁLISE DE ENGAGEMENT AVANÇADA
      let engagementAnalysis = "";
      let postStats = "";
      let popularityTier = "";
      
      if (user.edge_owner_to_timeline_media?.count > 0 && user.edge_followed_by?.count > 0) {
        const posts = user.edge_owner_to_timeline_media.edges;
        const totalLikes = posts.reduce((sum, edge) => sum + (edge.node.edge_liked_by?.count || 0), 0);
        const totalComments = posts.reduce((sum, edge) => sum + (edge.node.edge_media_to_comment?.count || 0), 0);
        const totalViews = posts.reduce((sum, edge) => sum + (edge.node.video_view_count || 0), 0);
        
        const avgLikes = totalLikes / posts.length;
        const avgComments = totalComments / posts.length;
        const avgViews = totalViews / posts.length;
        const engagementRate = ((avgLikes / user.edge_followed_by.count) * 100).toFixed(2);
        
        // Tier de popularidade
        const followerCount = user.edge_followed_by?.count || 0;
        if (followerCount < 1000) popularityTier = "🌱 Iniciante";
        else if (followerCount < 10000) popularityTier = "🚀 Crescendo";
        else if (followerCount < 100000) popularityTier = "⭐ Micro-influencer";
        else if (followerCount < 1000000) popularityTier = "🎯 Influencer";
        else popularityTier = "🏆 Celebridade";
        
        engagementAnalysis = `
📈 Análise de Engajamento:
❤️ ${avgLikes.toFixed(0)} curtidas/post
💬 ${avgComments.toFixed(0)} comentários/post
👀 ${avgViews > 0 ? avgViews.toFixed(0) + ' views/vídeo' : '📷 Só fotos'}
📊 ${engagementRate}% taxa de engajamento
${popularityTier} - ${followerCount.toLocaleString()} seguidores
        `.trim();
        
        // Estatísticas dos posts
        const videoPosts = posts.filter(edge => edge.node.is_video).length;
        const photoPosts = posts.length - videoPosts;
        
        postStats = `
📊 Estatísticas dos Posts:
🖼️ ${photoPosts} fotos
🎥 ${videoPosts} vídeos
📦 ${posts.length} posts no total
        `.trim();
      }

      // 🔍 ANÁLISE DE ATIVIDADE DETALHADA
      let activityAnalysis = "";
      let lastPostsAnalysis = "";
      const postCount = user.edge_owner_to_timeline_media?.count || 0;
      
      if (postCount > 0) {
        const posts = user.edge_owner_to_timeline_media.edges.slice(0, 3);
        
        // Frequência de posts
        if (postCount < 10) activityAnalysis = "🐢 Posta raramente - vida offline";
        else if (postCount < 50) activityAnalysis = "🚶 Frequência normal - equilibrado";
        else if (postCount < 100) activityAnalysis = "🚀 Ativo - gosta de compartilhar";
        else activityAnalysis = "🤳 Super ativo - viciado em likes";

        // Análise dos últimos posts
        lastPostsAnalysis = "\n📅 Últimos 3 posts:\n";
        posts.forEach((edge, index) => {
          const post = edge.node;
          const postDate = new Date(post.taken_at_timestamp * 1000);
          const now = new Date();
          const diffHours = Math.floor(Math.abs(now - postDate) / (1000 * 60 * 60));
          
          let timeAgo = "";
          if (diffHours < 24) timeAgo = `${diffHours}h atrás`;
          else timeAgo = `${Math.floor(diffHours / 24)}d atrás`;
          
          lastPostsAnalysis += `${index + 1}. ${timeAgo} - ❤️${post.edge_liked_by?.count?.toLocaleString() || "0"} 💬${post.edge_media_to_comment?.count?.toLocaleString() || "0"} ${post.is_video ? "🎥" : "🖼️"}\n`;
        });
      }

      // 🕵️‍♂️ INFORMAÇÕES DETALHADAS DO PERFIL
      const verificationStatus = user.is_verified ? 
        "✅ Verificado - Conta autêntica" : "❌ Não verificado - Anônimo";
      
      const privacyStatus = user.is_private ? 
        "🔒 Privado - Seletivo" : "🔓 Público - Acessível";
      
      const accountType = user.is_business_account ? 
        "💼 Business - Perfil comercial" : "👤 Pessoal - Uso casual";
      
      const professionalStatus = user.is_professional_account ? 
        "🎯 Profissional - Trabalha com isso" : "😎 Casual - Hobby";

      // 🌐 DADOS DE CONTATO E LINKS
      let contactInfo = "";
      if (user.public_email || user.public_phone_country_code || user.public_phone_number) {
        contactInfo = "\n📞 Contato Público:\n";
        if (user.public_email) contactInfo += `📧 ${user.public_email}\n`;
        if (user.public_phone_number) contactInfo += `📱 ${user.public_phone_country_code} ${user.public_phone_number}\n`;
      }

      // 📍 LOCALIZAÇÃO
      let locationInfo = "";
      if (user.business_address_json) {
        try {
          const address = JSON.parse(user.business_address_json);
          if (address.city || address.country) {
            locationInfo = `📍 ${address.city || ''}${address.city && address.country ? ', ' : ''}${address.country || ''}`;
          }
        } catch (e) {}
      }

      // 🎨 CATEGORIA DETALHADA
      const categoryInfo = user.category_name ? 
        `🏷️ ${user.category_name}${user.category_enum ? ` (${user.category_enum})` : ''}` : 
        "🏷️ Sem categoria definida";

      // 📊 RELAÇÃO SEGUIDORES/SEGUINDO
      const followerRatio = user.edge_follow?.count > 0 ? 
        (user.edge_followed_by?.count / user.edge_follow?.count).toFixed(1) : "N/A";
      
      const ratioAnalysis = followerRatio !== "N/A" ? 
        (followerRatio > 10 ? "🌟 Muito popular" : 
         followerRatio > 5 ? "⭐ Popular" : 
         followerRatio > 2 ? "👍 Equilibrado" : "🤝 Segue bastante") : "";

      // 🎯 MONTAGEM DO RELATÓRIO COMPLETO
      const info = `
🕵️‍♂️ RELATÓRIO DE INVESTIGAÇÃO COMPLETA 📋

👤 IDENTIDADE:
@${user.username}
${user.full_name || "🤷 Nome não disponível"}
${profilePicInfo}
${locationInfo}
${categoryInfo}
📝 BIOGRAFIA:
${user.biography || "🤐 Sem biografia"}
📊 METRICAS DE POPULARIDADE:
👥 Seguidores: ${(user.edge_followed_by?.count || 0).toLocaleString()}
📋 Seguindo: ${(user.edge_follow?.count || 0).toLocaleString()}
📊 Posts: ${postCount.toLocaleString()}
📌 Destaques: ${user.highlight_reel_count?.toLocaleString() || "0"}
📈 Ratio: ${followerRatio} ${ratioAnalysis}
${engagementAnalysis}
${postStats}
🔍 STATUS DO PERFIL:
${verificationStatus}
${privacyStatus}
${accountType}
${professionalStatus}
📊 ${activityAnalysis}
${contactInfo}
${user.external_url ? `🔗 Link na bio: ${user.external_url}` : ""}
${user.website ? `🌐 Website: ${user.website}` : ""}
${lastPostsAnalysis}
🆔 DADOS TÉCNICOS:
ID: ${user.id || "N/A"}
📱 App: Instagram
      `.trim();

      // 📨 ENVIO DOS RESULTADOS
      if (profilePicBuffer) {
        await sendImageFromBuffer(profilePicBuffer, info, [], null);
      } else {
        await sendReply(info);
        if (profilePicUrl && profilePicInfo !== "❌ Imagem não disponível") {
          await sendReply(`🖼️ Foto do perfil: ${profilePicUrl}`);
        }
      }

    } catch (err) {
      console.error("Erro completo no comando IG:", err);
      
      if (err.response?.status === 404) {
        await sendErrorReply(
          "❌ Perfil não encontrado! \n\n" +
          "Verifique se: \n" +
          "✏️ O @ está correto\n" +  
          "👀 O usuário realmente existe\n" +
          "🔒 Não é conta privada"
        );
      } else if (err.response?.status === 429) {
        await sendErrorReply(
          "🚫 Muitas requisições! \n\n" +
          "O Instagram bloqueou minhas investigações! 🛑\n" +
          "Tenta de novo em 1-2 horas ⏰"
        );
      } else if (err.response?.status === 403) {
        await sendErrorReply(
          "🔒 Acesso negado! \n\n" +  
          "Esse perfil deve ser privado ou restrito! \n" +
          "Só seguindo pra ver o conteúdo 👀"
        );
      } else if (err.code === 'ECONNABORTED') {
        await sendErrorReply(
          "⏰ Tempo esgotado! \n\n" +
          "O Instagram tá demorando pra responder! \n" +
          "Tenta de novo mais tarde 🕐"
        );
      } else {
        await sendErrorReply(
          "💥 Deu ruim na investigação! \n\n" +
          "Possíveis culpados: \n" +
          "🔄 Instagram mudou a API\n" +
          "📡 Sua internet tá ruim\n" +
          "👻 O perfil sumiu\n" +
          "🍀 Azar mesmo\n\n" +
          "Tenta de novo aí, vai que cola! 😅"
        );
      }
    }
  },
};
