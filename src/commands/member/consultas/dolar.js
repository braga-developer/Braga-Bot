const { PREFIX } = require(`${BASE_DIR}/config`);
const axios = require("axios");

module.exports = {
  name: "dolar",
  description: "💵 Mostra a cotação atual do dólar e outras moedas",
  commands: ["dolar", "cotacao", "dollar", "moeda"],
  usage: `${PREFIX}dolar`,

  handle: async function (data) {
    const {
      sendReply,
      userJid,
      sendWaitReact,
      sendErrorReact,
    } = data;

    try {
      await sendWaitReact();

      const response = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL');
      const dados = response.data;

      const dolar = dados.USDBRL;
      const euro = dados.EURBRL;
      const bitcoin = dados.BTCBRL;

      const formatarMoeda = (valor) => {
        return parseFloat(valor).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      };

      const mensagem = 
        `💵 *COTAÇÃO DE MOEDAS*\n\n` +
        `🇺🇸 *DÓLAR AMERICANO*\n` +
        `💵 Compra: ${formatarMoeda(dolar.bid)}\n` +
        `💰 Venda: ${formatarMoeda(dolar.ask)}\n` +
        `📈 Variação: ${dolar.pctChange}%\n` +
        `🕒 Atualizado: ${new Date(dolar.create_date).toLocaleString('pt-BR')}\n\n` +
        
        `🇪🇺 *EURO*\n` +
        `💵 Compra: ${formatarMoeda(euro.bid)}\n` +
        `💰 Venda: ${formatarMoeda(euro.ask)}\n` +
        `📈 Variação: ${euro.pctChange}%\n\n` +
        
        `₿ *BITCOIN*\n` +
        `💵 Compra: ${formatarMoeda(bitcoin.bid)}\n` +
        `💰 Venda: ${formatarMoeda(bitcoin.ask)}\n` +
        `📈 Variação: ${bitcoin.pctChange}%\n\n` +
        
        `💡 *Fonte:* AwesomeAPI\n` +
        `🔄 *Atualizações em tempo real*`;

      await sendReply(mensagem, [userJid]);

    } catch (error) {
      console.error("[DOLAR ERROR]", error);
      await sendErrorReact();
      await sendReply(
        `❌ *ERRO NA COTAÇÃO*\n\n` +
        `💸 Não foi possível obter as cotações\n` +
        `💡 Tente novamente em alguns minutos`,
        [userJid]
      );
    }
  },
};
