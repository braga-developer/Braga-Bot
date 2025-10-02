// telefone.js
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const axios = require("axios");

const OPEN_SENSE_API = "https://open-sense-api.vercel.app";
const API_KEY = "QbAdLCjKvGHpvfTl";

module.exports = {
  name: "telefone",
  description: "Consulta informações de telefone",
  commands: ["telefone", "fone", "tel"],
  usage: `${PREFIX}telefone 11999999999`,

  handle: async ({ sendText, sendErrorReply, args, sendReact }) => {
    await sendReact("📱");
    if (!args.length) throw new InvalidParameterError("❗ Informe um telefone!");
    
    const telefone = onlyNumbers(args[0]);
    if (telefone.length < 10 || telefone.length > 11) {
      await sendErrorReply("❗ Telefone deve ter 10 ou 11 dígitos!");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${API_KEY}` };
      const response = await axios.get(`${OPEN_SENSE_API}/telefone/v1/${telefone}`, { headers, timeout: 10000 });
      
      if (response.data?.erro) {
        await sendErrorReply(`❌ ${response.data.erro}`);
        return;
      }
      
      const data = response.data?.dados || response.data;
      if (!data) {
        await sendErrorReply("❌ Telefone não encontrado!");
        return;
      }

      let message = `📱 *DADOS COMPLETOS DO TELEFONE*\n\n`;
      
      // Campos principais
      if (data.telefone) message += `📞 *TELEFONE:* ${data.telefone}\n`;
      else message += `📞 *TELEFONE:* ${telefone}\n`;
      
      if (data.ddd) message += `🔢 *DDD:* ${data.ddd}\n`;
      if (data.estado) message += `🏛️ *ESTADO:* ${data.estado}\n`;
      if (data.regiao) message += `🌍 *REGIÃO:* ${data.regiao}\n`;
      if (data.tipo) message += `📡 *TIPO:* ${data.tipo}\n`;
      else message += `📡 *TIPO:* ${telefone.length === 11 ? "Celular" : "Fixo"}\n`;
      
      // Operadoras
      if (data.operadora) message += `🏢 *OPERADORA:* ${data.operadora}\n`;
      if (data.operadoras && Array.isArray(data.operadoras)) {
        message += `📶 *OPERADORAS DISPONÍVEIS:* ${data.operadoras.join(", ")}\n`;
      }
      
      // Cidades
      if (data.cidades && Array.isArray(data.cidades) && data.cidades.length > 0) {
        message += `🏙️ *CIDADES:* `;
        if (data.cidades.length <= 5) {
          message += data.cidades.join(", ");
        } else {
          message += `${data.cidades.slice(0, 5).join(", ")}... (+${data.cidades.length - 5} cidades)`;
        }
        message += `\n`;
      }
      
      // Demais campos
      for (const [key, value] of Object.entries(data)) {
        if (!['telefone', 'ddd', 'estado', 'regiao', 'tipo', 'operadora', 'operadoras', 'cidades'].includes(key) && 
            value !== null && value !== undefined && value !== "" && value !== "null") {
          const formattedKey = key.replace(/_/g, ' ').toUpperCase();
          if (Array.isArray(value)) {
            message += `📋 *${formattedKey}:* ${value.slice(0, 3).join(", ")}`;
            if (value.length > 3) message += `... (+${value.length - 3})`;
            message += `\n`;
          } else {
            message += `📊 *${formattedKey}:* ${value}\n`;
          }
        }
      }

      await sendText(message);
    } catch (error) {
      if (error.response?.status === 401) {
        await sendErrorReply("❌ Chave de API inválida!");
      } else if (error.response?.status === 404) {
        await sendErrorReply("❌ Telefone não encontrado!");
      } else if (error.code === 'ECONNABORTED') {
        await sendErrorReply("⏰ Tempo de consulta excedido!");
      } else {
        await sendErrorReply("❌ Erro ao consultar telefone!");
      }
    }
  },
};
