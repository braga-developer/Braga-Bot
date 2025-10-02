const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "lero",
  description: "📝 Gera textos de lero-lero profissional para reuniões",
  commands: ["lero", "lerolero", "enrolation", "texto"],
  usage: `${PREFIX}lero`,

  handle: async function (data) {
    const {
      sendReply,
      userJid,
      sendWaitReact,
    } = data;

    const frases = [
      "Neste contexto, a complexidade dos estudos efetuados facilita a criação do fluxo de informações.",
      "Por outro lado, a contínua expansão de nossa atividade cumpre um papel essencial na formulação dos níveis de motivação departamental.",
      "Não obstante, o desenvolvimento contínuo de distintas formas de atuação apresenta tendências no sentido de aprovar a manutenção das posturas dos órgãos dirigentes com relação às suas atribuições.",
      "Assim mesmo, a consolidação das estruturas faz parte de um processo de gerenciamento dos modos de operação convencionais.",
      "O cuidado em identificar pontos críticos no aumento do diálogo entre os diferentes setores produtivos ainda não demonstrou convincentemente que vai participar na mudança das direções preferenciais no sentido do progresso.",
      "A prática cotidiana prova que a percepção das dificuldades é uma das consequências do sistema de participação geral.",
      "O empenho em analisar a execução dos pontos do programa promove a alavancagem do retorno esperado a longo prazo.",
      "Acima de tudo, é fundamental ressaltar que a determinação clara de objetivos auxilia a preparação e a composição do processo de comunicação como um todo.",
      "Todas estas questões, devidamente ponderadas, levantam dúvidas sobre se o novo modelo estrutural aqui preconizado assume importantes posições no estabelecimento de todos os recursos funcionais envolvidos.",
      "Do mesmo modo, o início da atividade geral de formação de atitudes acarreta um processo de reformulação e modernização dos procedimentos normalmente adotados.",
      "Evidentemente, a consulta aos diversos militantes garante a contribuição de um grupo importante na determinação do impacto na agilidade decisória.",
      "Gostaria de enfatizar que a mobilidade dos capitais internacionais talvez venha a ressaltar a relatividade das condições inegavelmente apropriadas.",
      "A nível organizacional, a competitividade nas transações comerciais causa impacto indireto na reavaliação dos paradigmas corporativos.",
      "Nunca é demais lembrar o peso e o significado destes problemas, uma vez que a necessidade de renovação processual prepara-nos para enfrentar situações atípicas decorrentes dos métodos utilizados na avaliação de resultados.",
      "Percebemos, cada vez mais, que a expansão dos mercados mundiais oferece uma interessante oportunidade para verificação das diversas correntes de pensamento."
    ];

    try {
      await sendWaitReact();

      // Gerar 3-5 frases aleatórias para formar o lero-lero
      const numFrases = Math.floor(Math.random() * 3) + 3;
      let leroTexto = "";
      
      for (let i = 0; i < numFrases; i++) {
        const frase = frases[Math.floor(Math.random() * frases.length)];
        leroTexto += frase + " ";
      }

      const mensagem = 
        `📝 *GERADOR DE LERO-LERO PROFISSIONAL*\n\n` +
        `${leroTexto.trim()}\n\n` +
        `🎯 *Características do texto:*\n` +
        `📊 ${numFrases} frases corporativas\n` +
        `💼 Linguagem empresarial avançada\n` +
        `🎭 Perfeito para reuniões e apresentações\n` +
        `🤓 Impressione seus colegas de trabalho!\n\n` +
        `💡 *Dica:* Use em reuniões quando não souber o que dizer`;

      await sendReply(mensagem, [userJid]);

    } catch (error) {
      console.error("[LERO ERROR]", error);
      await sendReply(
        `❌ *ERRO NO LERO-LERO*\n\n` +
        `📝 Nem mesmo enrolar está funcionando hoje!\n` +
        `💡 Tente novamente mais tarde`,
        [userJid]
      );
    }
  },
};
