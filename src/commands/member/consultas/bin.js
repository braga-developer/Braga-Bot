// bin.js
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const axios = require("axios");

const OPEN_SENSE_API = "https://open-sense-api.vercel.app";
const API_KEY = "QbAdLCjKvGHpvfTl";

module.exports = {
  name: "bin",
  description: "Consulta informações de BIN",
  commands: ["bin", "cartao"],
  usage: `${PREFIX}bin 123456`,

  handle: async ({ sendText, sendErrorReply, args, sendReact }) => {
    await sendReact("💳");
    if (!args.length) throw new InvalidParameterError("❗ Informe os 6 primeiros dígitos do cartão!");
    const bin = onlyNumbers(args[0]);
    if (bin.length !== 6) {
      await sendErrorReply("❗ BIN deve ter 6 dígitos!");
      return;
    }
    try {
      const response = await axios.get(`${OPEN_SENSE_API}/bin/${bin}`, {
        headers: { Authorization: `Bearer ${API_KEY}` }
      });
      const data = response.data;
      const message = `💳 *CONSULTA BIN*\n\n🔢 *BIN:* ${data.bin || bin}\n🏦 *Banco:* ${data.banco || "N/A"}\n🏢 *Bandeira:* ${data.bandeira || "N/A"}\n💳 *Tipo:* ${data.tipo || "N/A"}\n🌍 *País:* ${data.pais || "N/A"}\n📞 *Telefone:* ${data.telefone || "N/A"}`;
      await sendText(message);
    } catch (error) {
      await sendErrorReply("❌ Erro ao consultar BIN: " + error.message);
    }
  },
};
