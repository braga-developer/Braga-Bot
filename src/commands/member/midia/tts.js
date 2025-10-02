const { PREFIX } = require(`${process.cwd()}/src/config`);
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

module.exports = {
  name: "tts",
  description: "Converte texto em áudio usando síntese de voz",
  commands: ["tts", "texttospeech", "voz", "falar"],
  usage: `${PREFIX}tts <texto>`,

  handle: async function (data) {
    const {
      sendReply,
      args,
      userJid,
      message,
      sendAudioFromFile,
      sendWaitReact,
      sendErrorReact,
      sendSuccessReact,
    } = data;

    if (!args.length) {
      return await sendReply(
        `🎤 *TEXT TO SPEECH COMMAND*
❌ *Uso incorreto!*
📝 *Como usar:*
${PREFIX}tts <texto para converter em voz>
💡 *Exemplo:*
${PREFIX}tts Olá, como você está?
⚠️ *Limitações:*
Máximo 200 caracteres
Textos ofensivos serão bloqueados`,
        [userJid]
      );
    }

    const text = args.join(" ");
    const tempDir = path.join(process.cwd(), "assets", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // Verificar comprimento do texto
    if (text.length > 200) {
      if (sendErrorReact) await sendErrorReact();
      return await sendReply(
        `❌ *TEXTO MUITO LONGO*
📝 Máximo permitido: 200 caracteres
📊 Seu texto: ${text.length} caracteres`,
        [userJid]
      );
    }

    // Lista de palavras proibidas (conteúdo sensível)
    const forbiddenWords = [
      // Conteúdo racial/étnico
      "nigger", "nigga", "kike", "spic", "chink", "gook", "wetback",
      // Nazismo
      "heil hitler", "sieg heil", "hitler", "nazista", "swastika", "holocausto",
      // Discurso de ódio
      "morte aos", "mate todos", "exterminar", "limpeza étnica",
      // Conteúdo extremamente ofensivo
      "white power", "black power", "kill all", "allahu akbar",
      // Conteúdo sexual explícito
      "puta", "prostituta", "vadia", "filho da puta", "caralho", "porra", "foder", "foda"
    ];

    const textLower = text.toLowerCase();
    
    // Verificar conteúdo proibido
    const hasForbiddenContent = forbiddenWords.some(word => 
      textLower.includes(word.toLowerCase())
    );

    if (hasForbiddenContent) {
      if (sendErrorReact) await sendErrorReact();
      return await sendReply(
        `❌ *CONTEÚDO BLOQUEADO*
⚠️ Seu texto contém palavras ou frases proibidas
🔒 Medida de segurança anti-banimento ativada
📝 Revise seu texto e tente novamente`,
        [userJid]
      );
    }

    try {
      if (sendWaitReact) await sendWaitReact();

      const timestamp = Date.now();
      const audioFile = path.join(tempDir, `tts_${timestamp}.mp3`);

      // Gerar TTS usando gTTS
      await generateTTSWithGTTs(text, audioFile);

      // Verificar se o áudio foi gerado corretamente
      if (!fs.existsSync(audioFile) || fs.statSync(audioFile).size < 1000) {
        throw new Error("Arquivo de áudio inválido ou muito pequeno");
      }

      // ✅ CORREÇÃO: Usar o mesmo método do comando play
      // Enviar áudio como arquivo normal (não como voz)
      // asVoice: false para permitir reprodução normal
      await sendAudioFromFile(audioFile, false, message);

      // Mensagem de confirmação
      await sendReply(
        `🎤 *TEXTO CONVERTIDO PARA VOZ*
📝 *Texto:* ${text}
✅ *Áudio enviado com sucesso!*`,
        [userJid]
      );

      if (sendSuccessReact) await sendSuccessReact();

      // Limpeza do arquivo temporário após 30 segundos
      setTimeout(() => {
        try {
          if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
          console.log(`[TTS CLEANUP] Arquivo temporário removido: ${audioFile}`);
        } catch (cleanupError) {
          console.error("[TTS CLEANUP ERROR]", cleanupError);
        }
      }, 30000);

    } catch (error) {
      console.error("[TTS ERROR]", error);
      if (sendErrorReact) await sendErrorReact();
      await sendReply(
        `❌ *ERRO NA GERAÇÃO DE VOZ*
🔧 *Detalhes:* ${error.message}
💡 *Soluções:*
Tente um texto mais curto
Tente novamente em alguns segundos`,
        [userJid]
      );
    }
  },
};

// Função usando gTTS (Node.js) - Versão corrigida
async function generateTTSWithGTTs(text, outputFile) {
  return new Promise((resolve, reject) => {
    try {
      // Verificar se o gTTS está instalado
      try {
        require.resolve("gtts");
      } catch (e) {
        reject(new Error("Pacote gTTS não instalado. Execute: npm install gtts"));
        return;
      }

      const gtts = require("gtts");
      
      const gttsInstance = new gtts(text, 'pt-br'); // Português Brasil
      
      gttsInstance.save(outputFile, (err, result) => {
        if (err) {
          console.error("[gTTS SAVE ERROR]", err);
          reject(new Error(`Falha ao salvar áudio: ${err.message}`));
        } else {
          console.log(`[gTTS SUCCESS] Áudio salvo em: ${outputFile}`);
          // Aguardar um pouco para garantir que o arquivo foi escrito completamente
          setTimeout(() => {
            resolve();
          }, 1000);
        }
      });
      
    } catch (error) {
      console.error("[gTTS INIT ERROR]", error);
      reject(new Error(`Erro na inicialização do gTTS: ${error.message}`));
    }
  });
}

// Função alternativa usando Python (caso o gTTS do Node não funcione)
async function generateTTSWithPython(text, outputFile) {
  return new Promise((resolve, reject) => {
    const pythonScript = `
from gtts import gTTS
import sys
import os

text = sys.argv[1]
output_file = sys.argv[2]

try:
    tts = gTTS(text=text, lang='pt-br', slow=False)
    tts.save(output_file)
    # Verificar se o arquivo foi criado
    if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
        print("SUCCESS: Audio generated successfully")
        sys.exit(0)
    else:
        print("ERROR: Audio file not created or empty")
        sys.exit(1)
except Exception as e:
    print(f"ERROR: {str(e)}")
    sys.exit(1)
    `;

    const pythonFile = path.join(tempDir, `tts_script_${Date.now()}.py`);
    fs.writeFileSync(pythonFile, pythonScript);

    const pythonCommand = ["python3", pythonFile, text, outputFile];

    const proc = spawn(pythonCommand[0], pythonCommand.slice(1));
    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      proc.kill();
      if (fs.existsSync(pythonFile)) fs.unlinkSync(pythonFile);
      reject(new Error("Timeout - geração de voz muito lenta"));
    }, 60000);

    proc.stdout.on("data", (data) => { stdout += data.toString(); });
    proc.stderr.on("data", (data) => { stderr += data.toString(); });
    
    proc.on("close", (code) => {
      clearTimeout(timeout);
      // Limpar script Python temporário
      if (fs.existsSync(pythonFile)) fs.unlinkSync(pythonFile);
      
      if (code === 0) {
        console.log(`[PYTHON TTS SUCCESS] ${stdout}`);
        resolve();
      } else {
        console.error(`[PYTHON TTS ERROR] Code: ${code}, Stderr: ${stderr}`);
        reject(new Error(`Falha na geração Python: ${stderr || stdout || code}`));
      }
    });
    
    proc.on("error", (err) => {
      if (fs.existsSync(pythonFile)) fs.unlinkSync(pythonFile);
      reject(new Error(`Erro ao executar Python: ${err.message}`));
    });
  });
}
