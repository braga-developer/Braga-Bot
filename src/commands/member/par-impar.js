const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "parouimpar",
  description: "🎮 Jogue par ou ímpar contra o bot",
  commands: ["parouimpar", "parimpar", "evenodd", "pi"],
  usage: `${PREFIX}parouimpar par 5`,

  handle: async ({ args, userJid, sendReply }) => {
    if (args.length < 2) {
      throw new DangerError(
        `🎯 Escolha par/ímpar e um número.\n\nExemplo: ${PREFIX}parouimpar par 5`
      );
    }

    const choice = args[0].toLowerCase();
    const playerNumber = parseInt(args[1]);

    if (choice !== 'par' && choice !== 'ímpar' && choice !== 'impar') {
      throw new DangerError("❌ Escolha 'par' ou 'ímpar'.");
    }

    if (isNaN(playerNumber) || playerNumber < 0 || playerNumber > 10) {
      throw new DangerError("❌ Escolha um número entre 0 e 10.");
    }

    const botNumber = Math.floor(Math.random() * 11);
    const total = playerNumber + botNumber;
    const result = total % 2 === 0 ? 'par' : 'ímpar';

    const playerWon = choice === result;

    await sendReply(
      `✋ *PAR OU ÍMPAR*\n\n` +
      `👤 @${userJid.split('@')[0]}: ${choice} (${playerNumber})\n` +
      `🤖 Bot: ${botNumber}\n` +
      `🔢 Total: ${total} (${result})\n\n` +
      `🎯 *Resultado:* ${playerWon ? '🎉 Você ganhou!' : '❌ Eu ganhei!'}`,
      [userJid]
    );
  },
};
