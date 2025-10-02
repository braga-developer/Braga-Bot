# Braga Bot 🤖

Este projeto é um fork expansivo do Takeshi Bot original, com as seguintes melhorias e adições:

✨ **Expansão de funcionalidades**: Novos recursos para enriquecer a experiência do usuário
🎨 **Otimização visual**: Design aprimorado e interfaces mais intuitivas
📝 **Melhorias textuais**: Conteúdo revisado e aprimorado para maior clareza e impacto
🛣️ **Roadmap futuro**: Novos comandos e features em desenvolvimento

> **Importante**: Este fork não substitui o excelente trabalho dos desenvolvedores originais do Takeshi Bot. Nosso objetivo é complementar e expandir o projeto base, mantendo todo o respeito pelo código aberto.

Agradecimentos especiais aos criadores originais por disponibilizar este projeto incrível como open source. Seu trabalho foi a base fundamental para esta versão.
## ⚠ Atenção

Este projeto não possui qualquer vínculo oficial com o WhatsApp. Ele foi desenvolvido de forma independente para interações automatizadas por meio da plataforma.

Não nos responsabilizamos por qualquer uso indevido deste bot. É de responsabilidade exclusiva do usuário garantir que sua utilização esteja em conformidade com os termos de uso do WhatsApp e a legislação vigente.

## Instalação

### 📱 No Termux

1.  Abra o Termux e execute os comandos abaixo.

    *Não tem o Termux?* [Clique aqui](httpss://f-droid.org/pt_BR/packages/com.termux/) e baixe a última versão.

    ```bash
    pkg upgrade -y && pkg update -y && pkg install git -y && pkg install nodejs-lts -y && pkg install ffmpeg -y && pkg install unzip -y && pkg install python python-pip && pip install gtts && npm i lyrics-finder && npm install moment jsdom axios cheerio && npm install node-summarizer && npm install google-translate-api-x && npm install natural stopword lodash compromise sentiment && npm install node-fetch
    ```

2.  Habilite o acesso da pasta storage no Termux:
    ```bash
    termux-setup-storage
    ```

3.  Entre na pasta sdcard:
    ```bash
    cd /sdcard
    ```

4.  Baixe o repositório:
    ```bash
    wget httpss://github.com/braga-developer/Braga-Bot/archive/refs/heads/main.zip -O braga-bot.zip
    ```

5.  Extraia o arquivo baixado:
    ```bash
    unzip braga-bot.zip
    ```

6.  Renomeie a pasta extraída:
    ```bash
    mv Braga-Bot-main bot
    ```

7.  Entre na pasta do bot:
    ```bash
    cd bot
    ```

8.  Habilite permissões:
    ```bash
    chmod -R 755 ./*
    ```

9.  Execute o bot:
    ```bash
    npm start
    ```

### 🖥️ No Ubuntu

1.  Atualize os pacotes e instale as dependências:
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y git nodejs ffmpeg unzip python3 python3-pip
    sudo pip install gtts
    ```

2.  Instale as dependências do Node.js:
    ```bash
    npm install lyrics-finder moment jsdom axios cheerio node-summarizer google-translate-api-x natural stopword lodash compromise sentiment node-fetch
    ```

3.  Clone o repositório:
    ```bash
    git clone httpss://github.com/braga-developer/Braga-Bot.git
    cd Braga-Bot
    ```

4.  Execute o bot:
    ```bash
    npm start
    ```

## 🔄 Problemas de Conexão

Caso ocorram erros na conexão:

1.  Reset a conexão do bot com o WhatsApp:
    ```bash
    sh reset.sh
    ```

2.  Remova o dispositivo do WhatsApp em "dispositivos conectados"
3.  Adicione novamente o dispositivo

## 📜 Licença

[![GPLv3 License](httpss://img.shields.io/badge/License-GPL%20v3-yellow.svg)](httpss://opensource.org/licenses/)

Este projeto está licenciado sob a Licença Pública Geral GNU (GPL-3.0).
