// cnpj.js
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const axios = require("axios");

const OPEN_SENSE_API = "https://open-sense-api.vercel.app";
const API_KEY = "QbAdLCjKvGHpvfTl";

module.exports = {
  name: "consultacnpj",
  description: "Consulta dados de CNPJ",
  commands: ["consultacnpj", "cnpj", "empresa"],
  usage: `${PREFIX}cnpj 12345678000195`,

  handle: async ({ sendText, sendErrorReply, args, sendReact, sendReply }) => {
    await sendReact("🏢");
    if (!args.length) throw new InvalidParameterError("❗ Informe um CNPJ!");
    
    const cnpj = onlyNumbers(args[0]);
    if (cnpj.length !== 14) {
      await sendErrorReply("❗ CNPJ deve ter 14 dígitos!");
      return;
    }

    try {
      await sendReply("🔎 Buscando informações...");
      const headers = { Authorization: `Bearer ${API_KEY}` };
      const response = await axios.get(`${OPEN_SENSE_API}/cnpj/v2/${cnpj}`, { headers, timeout: 15000 });
      
      if (response.data?.erro) {
        await sendErrorReply(`❌ ${response.data.erro}`);
        return;
      }
      
      const data = response.data?.dados || response.data;
      if (!data || data.status === "ERROR") {
        await sendErrorReply("❌ CNPJ não encontrado!");
        return;
      }

      const cnpjFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      
      let message = `🏢 *DADOS COMPLETOS DO CNPJ*\n\n`;
      message += `🆔 *CNPJ:* ${cnpjFormatado}\n\n`;
      
      // Função para formatar valores
      const formatValue = (value) => {
        if (value === null || value === undefined || value === "" || value === "null") return null;
        return value;
      };

      // Campos principais
      if (formatValue(data.nome)) message += `📛 *RAZÃO SOCIAL:* ${data.nome}\n`;
      if (formatValue(data.fantasia)) message += `🏷️ *NOME FANTASIA:* ${data.fantasia}\n`;
      if (formatValue(data.situacao)) message += `📌 *SITUAÇÃO:* ${data.situacao}\n`;
      if (formatValue(data.abertura)) message += `📅 *DATA ABERTURA:* ${data.abertura}\n`;
      if (formatValue(data.tipo)) message += `⚖️ *TIPO:* ${data.tipo}\n`;
      if (formatValue(data.porte)) message += `🏢 *PORTE:* ${data.porte}\n`;
      if (formatValue(data.natureza_juridica)) message += `📋 *NATUREZA JURÍDICA:* ${data.natureza_juridica}\n`;
      
      // Endereço
      if (formatValue(data.logradouro) || formatValue(data.numero) || formatValue(data.bairro) || 
          formatValue(data.municipio) || formatValue(data.uf) || formatValue(data.cep)) {
        message += `\n📍 *ENDEREÇO*\n`;
        if (formatValue(data.logradouro)) message += `🏠 *Logradouro:* ${data.logradouro}\n`;
        if (formatValue(data.numero)) message += `🔢 *Número:* ${data.numero}\n`;
        if (formatValue(data.complemento)) message += `➕ *Complemento:* ${data.complemento}\n`;
        if (formatValue(data.bairro)) message += `🏙️ *Bairro:* ${data.bairro}\n`;
        if (formatValue(data.municipio)) message += `🌆 *Município:* ${data.municipio}\n`;
        if (formatValue(data.uf)) message += `🏛️ *UF:* ${data.uf}\n`;
        if (formatValue(data.cep)) message += `📮 *CEP:* ${data.cep}\n`;
      }
      
      // Contato
      if (formatValue(data.telefone) || formatValue(data.email)) {
        message += `\n📞 *CONTATO*\n`;
        if (formatValue(data.telefone)) message += `📱 *Telefone:* ${data.telefone}\n`;
        if (formatValue(data.email)) message += `✉️ *Email:* ${data.email}\n`;
      }
      
      // Capital
      if (formatValue(data.capital_social)) {
        message += `\n💰 *CAPITAL SOCIAL:* R$ ${parseFloat(data.capital_social).toLocaleString("pt-BR", {minimumFractionDigits: 2})}\n`;
      }
      
      // Atividades
      if (data.atividade_principal && Array.isArray(data.atividade_principal) && data.atividade_principal.length > 0) {
        message += `\n💼 *ATIVIDADE PRINCIPAL*\n`;
        data.atividade_principal.forEach(atividade => {
          if (atividade.code && atividade.text) {
            message += `📊 ${atividade.code} - ${atividade.text}\n`;
          }
        });
      }
      
      if (data.atividades_secundarias && Array.isArray(data.atividades_secundarias) && data.atividades_secundarias.length > 0) {
        message += `\n🔧 *ATIVIDADES SECUNDÁRIAS*\n`;
        data.atividades_secundarias.slice(0, 5).forEach(atividade => {
          if (atividade.code && atividade.text) {
            message += `📊 ${atividade.code} - ${atividade.text}\n`;
          }
        });
        if (data.atividades_secundarias.length > 5) {
          message += `📈 ... e mais ${data.atividades_secundarias.length - 5} atividades\n`;
        }
      }
      
      // Demais campos
      const camposIgnorados = ['nome', 'fantasia', 'situacao', 'abertura', 'tipo', 'porte', 'natureza_juridica', 
                              'logradouro', 'numero', 'complemento', 'bairro', 'municipio', 'uf', 'cep',
                              'telefone', 'email', 'capital_social', 'atividade_principal', 'atividades_secundarias'];
      
      let hasAdditionalFields = false;
      for (const [key, value] of Object.entries(data)) {
        if (!camposIgnorados.includes(key) && formatValue(value)) {
          if (!hasAdditionalFields) {
            message += `\n📋 *INFORMAÇÕES ADICIONAIS*\n`;
            hasAdditionalFields = true;
          }
          const formattedKey = key.replace(/_/g, ' ').toUpperCase();
          message += `📊 *${formattedKey}:* ${value}\n`;
        }
      }
      
      message += `\n⏰ *Consulta realizada em:* ${new Date().toLocaleString("pt-BR")}`;
      
      await sendText(message);
    } catch (error) {
      if (error.response?.status === 401) {
        await sendErrorReply("❌ Chave de API inválida!");
      } else if (error.response?.status === 404) {
        await sendErrorReply("❌ CNPJ não encontrado!");
      } else if (error.code === 'ECONNABORTED') {
        await sendErrorReply("⏰ Tempo de consulta excedido!");
      } else {
        await sendErrorReply("❌ Erro ao consultar CNPJ!");
      }
    }
  },
};
        
