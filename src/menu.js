/**
 * Menu do bot - Tema Máfia
 */
const { BOT_NAME } = require("./config");
const packageInfo = require("../package.json");
const { readMore } = require("./utils");
const { getPrefix } = require("./utils/database");

exports.menuMessage = (groupJid) => {
  const date = new Date();
  const prefix = getPrefix(groupJid);

  return `
╭━━━━━━━━━━◥◣◆◢◤━━━━━━━━━━╮${readMore()}
            🕴️ *${BOT_NAME}* 🕴️
╰━━━━━━━━━━◢◤◆◥◣━━━━━━━━━━╯

▩▩▩ *INFORMAÇÕES DO SISTEMA* ▩▩▩
╔═══════════════════════╗
▢ 🗓️  Data: ${date.toLocaleDateString("pt-br")}
▢ ⏰  Hora: ${date.toLocaleTimeString("pt-br")}
▢ 🔣  Prefixo: ${prefix}
▢ 🏷️  Versão: ${packageInfo.version}
╚═══════════════════════╝

🔫 *COMANDOS DO DONO* 🔫
╔═══════════════════════╗
▢ ${prefix}off
▢ ${prefix}on  
▢ ${prefix}set-menu-image
▢ ${prefix}set-prefix
╚═══════════════════════╝

👑 *COMANDOS DE ADMIN* 👑
╔═══════════════════════╗
▢ ${prefix}open
▢ ${prefix}add-auto-responder
▢ ${prefix}agendar-mensagem
▢ ${prefix}anti-audio (1/0)
▢ ${prefix}anti-document (1/0)
▢ ${prefix}anti-event (1/0)
▢ ${prefix}anti-image (1/0)
▢ ${prefix}anti-link (1/0)
▢ ${prefix}anti-video (1/0)
▢ ${prefix}ban
▢ ${prefix}close
▢ ${prefix}everyone
▢ ${prefix}limpar
▢ ${prefix}link-grupo
▢ ${prefix}list-auto-responder
▢ ${prefix}mute
▢ ${prefix}only-admin (1/0)
▢ ${prefix}promover
▢ ${prefix}rebaixar
▢ ${prefix}revelar
▢ ${prefix}unmute
▢ ${prefix}welcome (1/0)
╚═══════════════════════╝

💼 *COMANDOS PRINCIPAIS* 💼
╔═══════════════════════╗
▢ ${prefix}gerar-link
▢ ${prefix}perfil
▢ ${prefix}ping
▢ ${prefix}rename
▢ ${prefix}to-image
▢ ${prefix}tts
▢ ${prefix}yt-info
▢ ${prefix}letra
▢ ${prefix}lista-adm
▢ ${prefix}anime
▢ ${prefix}ppt
▢ ${prefix}qr
▢ ${prefix}traduzir
╚═══════════════════════╝

📥 *DOWNLOADS* 📥
╔═══════════════════════╗
▢ ${prefix}musica
▢ ${prefix}video
╚═══════════════════════╝

🎭 *RANKINGS DA FAMÍLIA* 🎭
╔═══════════════════════╗
▢ ${prefix}rank-cabaco
▢ ${prefix}rank-gay
▢ ${prefix}rank-cafe
▢ ${prefix}rank-bvl
▢ ${prefix}rank-azar
▢ ${prefix}rank-punheta
▢ ${prefix}rank-sirirca
▢ ${prefix}rank-corno
▢ ${prefix}rank-transante
▢ ${prefix}rank-hehe
╚═══════════════════════╝

🔍 *MEDIDORES E TESTES* 🔍
╔═══════════════════════╗
▢ ${prefix}medir-corno
▢ ${prefix}medir-fdp
▢ ${prefix}ship
╚═══════════════════════╝

🎪 *BRINCADEIRAS* 🎪
╔═══════════════════════╗
▢ ${prefix}abracar
▢ ${prefix}beijar
▢ ${prefix}dado
▢ ${prefix}jantar
▢ ${prefix}lutar
▢ ${prefix}matar
▢ ${prefix}soca
▢ ${prefix}torta
╚═══════════════════════╝

🏢 *LOCAIS E SERVIÇOS* 🏢
╔═══════════════════════╗
▢ ${prefix}puteiro
▢ ${prefix}balada
▢ ${prefix}telefone
▢ ${prefix}bin
▢ ${prefix}CNPJ
╚═══════════════════════╝

🖼️ *CANVAS E MÍDIAS* 🖼️
╔═══════════════════════╗
▢ ${prefix}efeito-img
▢ ${prefix}sticker
╚═══════════════════════╝

    `;
};
