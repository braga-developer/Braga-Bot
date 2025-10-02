const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "jokempo",
  description: "🎮 Jogue pedra, papel e tesoura contra o bot",
  commands: ["jokempo", "jokenpo", "ppt", "rps", "pedrapapeltesoura"],
  usage: `${PREFIX}jokempo pedra`,

  handle: async ({
    args,
    userJid,
    sendReply,
    sendReact,
  }) => {
    await sendReact("🎮");
    
    if (!args.length) {
      throw new DangerError(
        `🎮 *JOKEMPO - COMO JOGAR*\n\n` +
        `Escolha: *pedra*, *papel* ou *tesoura*\n\n` +
        `💡 *Exemplos:*\n` +
        `${PREFIX}jokempo pedra\n` +
        `${PREFIX}ppt papel\n` +
        `${PREFIX}rps tesoura`
      );
    }

    const playerChoice = args[0].toLowerCase();
    const choices = ['pedra', 'papel', 'tesoura'];
    const extendedChoices = [...choices, 'lagarto', 'spock'];
    
    // Modo estendido?
    const isExtended = extendedChoices.includes(playerChoice);
    const availableChoices = isExtended ? extendedChoices : choices;

    if (!availableChoices.includes(playerChoice)) {
      throw new DangerError(
        `❌ *ESCOLHA INVÁLIDA*\n\n` +
        `Opções disponíveis: ${availableChoices.join(', ')}\n` +
        `💡 *Dica:* Use apenas uma das opções acima`
      );
    }

    const botChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
    
    const emojis = {
      pedra: '👊',
      papel: '✋', 
      tesoura: '✌️',
      lagarto: '🤏',
      spock: '🖖'
    };

    let result;
    let resultEmoji;

    // Lógica básica
    if (playerChoice === botChoice) {
      result = "🤝 *Empate!*";
      resultEmoji = "⚖️";
    } else if (
      // Regras básicas
      (playerChoice === 'pedra' && botChoice === 'tesoura') ||
      (playerChoice === 'papel' && botChoice === 'pedra') ||
      (playerChoice === 'tesoura' && botChoice === 'papel') ||
      // Regras estendidas
      (playerChoice === 'pedra' && botChoice === 'lagarto') ||
      (playerChoice === 'papel' && botChoice === 'spock') ||
      (playerChoice === 'tesoura' && botChoice === 'lagarto') ||
      (playerChoice === 'lagarto' && botChoice === 'spock') ||
      (playerChoice === 'lagarto' && botChoice === 'papel') ||
      (playerChoice === 'spock' && botChoice === 'tesoura') ||
      (playerChoice === 'spock' && botChoice === 'pedra')
    ) {
      result = "🎉 *Você ganhou!*";
      resultEmoji = "🏆";
    } else {
      result = "😎 *Eu ganhei!*";
      resultEmoji = "🤖";
    }

    const gameMode = isExtended ? "🔄 *Modo Estendido*" : "🎯 *Modo Clássico*";

    await sendReply(
      `🎮 *JOKEMPO* ${gameMode}\n\n` +
      `👤 *Você:* ${emojis[playerChoice]} ${playerChoice}\n` +
      `🤖 *Bot:* ${emojis[botChoice]} ${botChoice}\n\n` +
      `${resultEmoji} *Resultado:* ${result}\n\n` +
      `💡 *Dica:* ${isExtended ? 
        'Jogue no modo clássico com: pedra, papel ou tesoura' : 
        'Experimente: lagarto ou spock para modo estendido!'}`,
      [userJid]
    );
  },
};
