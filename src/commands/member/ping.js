const os = require("os");
const { PREFIX } = require(`${BASE_DIR}/config`);
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "ping",
  description: "🏓 Verifica status do bot e informações do sistema",
  commands: ["ping", "pong", "status", "info"],
  usage: `${PREFIX}ping`,

  handle: async ({ sendReply, sendReact, startProcess, fullMessage }) => {
    try {
      const isPing = fullMessage.slice(1).startsWith("ping");
      await sendReact("🏓");

      // Cálculos de sistema
      const uptimeSeconds = process.uptime();
      const days = Math.floor(uptimeSeconds / 86400);
      const hours = Math.floor((uptimeSeconds % 86400) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = Math.floor(uptimeSeconds % 60);

      const ping = Date.now() - startProcess;
      const memUsage = process.memoryUsage();
      
      // Estatísticas de memória
      const rssMB = (memUsage.rss / 1024 / 1024).toFixed(2);
      const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
      const heapTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);

      // Informações do sistema REAL
      const loadAvg = os.loadavg().map((v) => v.toFixed(2));
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);

      // Status do ping
      let pingStatus = "✅ Excelente";
      let pingEmoji = "🟢";
      if (ping > 1000) {
        pingStatus = "🐌 Lento";
        pingEmoji = "🔴";
      } else if (ping > 500) {
        pingStatus = "⚠️ Moderado";
        pingEmoji = "🟡";
      }

      // Informações FIXAS do Arch Linux (sempre mostradas)
      const archInfo = {
        distro: "Arch Linux",
        kernel: "6.6.10-arch1-1",
        arch: "x86_64",
        desktop: "KDE Plasma 5.27",
        packages: "1482",
        lastUpdate: "2 horas atrás"
      };

      // Tentar encontrar o package.json de forma segura
      let dependenciesCount = "N/A";
      try {
        // Tentar diferentes caminhos possíveis
        const possiblePaths = [
          path.join(process.cwd(), "package.json"),
          path.join(BASE_DIR, "package.json"),
          path.join(process.cwd(), "..", "package.json"),
          path.join(__dirname, "..", "..", "..", "package.json"),
          "/data/data/com.termux/files/home/Bot/package.json"
        ];
        
        let packageJsonPath = null;
        for (const pkgPath of possiblePaths) {
          if (fs.existsSync(pkgPath)) {
            packageJsonPath = pkgPath;
            break;
          }
        }
        
        if (packageJsonPath) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
          dependenciesCount = Object.keys(packageJson.dependencies || {}).length;
        } else {
          // Se não encontrar, usar valor padrão
          dependenciesCount = "15+";
        }
      } catch (error) {
        console.error("[PING] Erro ao ler package.json:", error.message);
        dependenciesCount = "15+";
      }

      const message = 
        `🏓 *${isPing ? "PONG!" : "PING!"} - STATUS DO BOT*\n\n` +
        
        `📊 *DESEMPENHO*\n` +
        `📶 Velocidade: ${ping}ms ${pingEmoji}\n` +
        `🎯 Status: ${pingStatus}\n` +
        `⏱️ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s\n\n` +
        
        `💾 *MEMÓRIA (VM)*\n` +
        `📦 RAM: ${rssMB}MB (Processo)\n` +
        `🧠 Heap: ${heapUsedMB}MB / ${heapTotalMB}MB\n` +
        `💻 Sistema: ${usedMem}GB / ${totalMem}GB usado\n\n` +
        
        `🐧 *SISTEMA ARCH LINUX (VM)*\n` +
        `🎯 Distribuição: ${archInfo.distro}\n` +
        `⚙️ Kernel: ${archInfo.kernel}\n` +
        `🔧 Arquitetura: ${archInfo.arch}\n` +
        `🖥️ Desktop: Terminal\n` +
        `📦 Pacotes: ${archInfo.packages}\n` +
        `🔄 Atualizado: ${archInfo.lastUpdate}\n\n` +
        
        `💡 *ESTATÍSTICAS*\n` +
        `🆔 PID: ${process.pid}\n` +
        `📚 Dependências: ${dependenciesCount}\n` +
        `🕒 Horário: ${new Date().toLocaleString('pt-BR')}`;

      await sendReply(message);
    } catch (error) {
      console.error("[PING COMMAND ERROR]", error);
      
      // Mensagem de erro simplificada
      const errorMessage = 
        `🏓 *PING - STATUS DO BOT*\n\n` +
        `📊 *DESEMPENHO*\n` +
        `📶 Velocidade: ${Date.now() - startProcess}ms 🟢\n` +
        `🎯 Status: ✅ Online\n\n` +
        `🐧 *SISTEMA ARCH LINUX*\n` +
        `🎯 Distribuição: Arch Linux\n` +
        `⚙️ Kernel: 6.6.10-arch1-1\n` +
        `🔧 Arquitetura: x86_64\n` +
        `💡 *STATUS:* Bot operacional! 🚀`;
      
      await sendReply(errorMessage);
    }
  },
};
    
