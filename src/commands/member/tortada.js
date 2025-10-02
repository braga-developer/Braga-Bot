const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserJid } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "tacartorta",
  description: "🥧 Taca tortas virtuais com estilo!",
  commands: ["tacartorta", "torta", "taca", "tortada", "pie"],
  usage: `${PREFIX}tacartorta @usuario`,

  handle: async ({
    sendText,
    sendErrorReply,
    userJid,
    replyJid,
    args,
    isReply,
    sendReact,
  }) => {
    await sendReact("🥧");
    
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        `🥧 *TORTADA VIRTUAL*\n\n` +
        `❌ Você precisa mencionar ou responder alguém!\n\n` +
        `💡 *Como usar:*\n` +
        `${PREFIX}tacartorta @usuario\n` +
        `Ou responda a mensagem de alguém com o comando!`
      );
    }

    const targetJid = isReply ? replyJid : toUserJid(args[0]);

    if (!targetJid) {
      await sendErrorReply(
        "❌ Alvo inválido! Mencione @alguém ou responda uma mensagem."
      );
      return;
    }

    const userNumber = userJid.split('@')[0];
    const targetNumber = targetJid.split('@')[0];

    const tortas = [
      {
        frase: `🥧💥 @${userNumber} jogou uma torta de CREME na cara de @${targetNumber}! Que bagunça deliciosa! 😆`,
        reacao: "🤤"
      },
      {
        frase: `🎯 @${userNumber} não teve dó e tacou uma torta de LIMÃO em @${targetNumber}! Azedou! 😂`,
        reacao: "😖"
      },
      {
        frase: `😱 Ops! @${targetNumber} foi surpreendido por uma torta de MORANGO lançada por @${userNumber}! 🥳`,
        reacao: "🍓"
      },
      {
        frase: `🚀 Torta de CHOCOLATE voando! @${userNumber} acertou em cheio @${targetNumber}! 🍰🔥`,
        reacao: "🍫"
      },
      {
        frase: `🎉 @${userNumber} atirou uma torta de FRUTAS VERMELHAS e acertou @${targetNumber} em cheio! Quem vai limpar agora? 🤣`,
        reacao: "🫐"
      },
      {
        frase: `🍰💥 Boom! @${userNumber} tacou uma torta de NOZES no rosto de @${targetNumber}! Que momento crocante! 🤭`,
        reacao: "🌰"
      },
      {
        frase: `👑 @${userNumber} com precisão cirúrgica acertou @${targetNumber} com uma torta REAL! Todo sujo de chantilly! 🎂`,
        reacao: "👑"
      }
    ];

    const tortaEscolhida = tortas[Math.floor(Math.random() * tortas.length)];

    await sendText(
      `${tortaEscolhida.frase}\n\n` +
      `💬 *Reação esperada:* ${tortaEscolhida.reacao}\n` +
      `🏆 *Precisão:* ${Math.floor(Math.random() * 100) + 1}%\n` +
      `🎯 *Alcance:* ${Math.floor(Math.random() * 10) + 1}m\n` +
      `💥 *Impacto:* ${Math.floor(Math.random() * 5) + 1}/5`,
      [userJid, targetJid]
    );
  },
};
