const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
    name: "aniver",
    description: "Mostra informações completas sobre a pessoa usando sua data de nascimento.",
    commands: ["aniver", "aniversario", "niver"],
    usage: `${PREFIX}aniver DD-MM-AAAA`,
    handle: async ({ sendReply, sendReact, args, startProcess }) => {
        try {
            await sendReact("📅");

            if (!args || args.length === 0) {
                return await sendReply("❌ Por favor, forneça uma data de nascimento no formato *DD-MM-AAAA*.\nExemplo: _/aniver 15-05-1990_");
            }

            let dataString = args[0].trim();
            
            if (!/^\d{1,2}-\d{1,2}-\d{4}$/.test(dataString)) {
                return await sendReply("❌ Formato inválido. Use *DD-MM-AAAA*.\nExemplo: _/aniver 15-05-1990_");
            }

            const partes = dataString.split('-');
            const dia = parseInt(partes[0]);
            const mes = parseInt(partes[1]);
            const ano = parseInt(partes[2]);

            if (dia < 1 || dia > 31) {
                return await sendReply("❌ Dia inválido. O dia deve estar entre 1 e 31.");
            }

            if (mes < 1 || mes > 12) {
                return await sendReply("❌ Mês inválido. O mês deve estar entre 1 e 12.");
            }

            if (ano < 1900 || ano > new Date().getFullYear()) {
                return await sendReply(`❌ Ano inválido. O ano deve estar entre 1900 e ${new Date().getFullYear()}.`);
            }

            const nascimento = new Date(ano, mes - 1, dia);
            if (nascimento.getFullYear() !== ano || nascimento.getMonth() + 1 !== mes || nascimento.getDate() !== dia) {
                return await sendReply("❌ Data inválida. Por favor, verifique o dia, mês e ano.");
            }

            const hoje = new Date();
            if (nascimento > hoje) {
                return await sendReply("❌ A data de nascimento não pode ser no futuro.");
            }

            const calcularIdade = (nasc) => {
                const hoje = new Date();
                let anos = hoje.getFullYear() - nasc.getFullYear();
                let meses = hoje.getMonth() - nasc.getMonth();
                let dias = hoje.getDate() - nasc.getDate();
                
                if (dias < 0) {
                    meses--;
                    const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
                    dias += ultimoMes.getDate();
                }
                
                if (meses < 0) {
                    anos--;
                    meses += 12;
                }
                
                const segundos = Math.floor((hoje - nasc) / 1000);
                return { anos, meses, dias, segundos };
            };

            const calcularFaltam18 = (nasc) => {
                const data18 = new Date(nasc);
                data18.setFullYear(data18.getFullYear() + 18);
                const hoje = new Date();
                
                if (data18 <= hoje) {
                    return { jaFez18: true, data18 };
                }
                
                const diff = data18.getTime() - hoje.getTime();
                const diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
                const anos = Math.floor(diasRestantes / 365);
                const meses = Math.floor((diasRestantes % 365) / 30);
                const dias = diasRestantes % 30;
                
                return { jaFez18: false, anos, meses, dias, data18 };
            };

            const calcularSigno = (dia, mes) => {
                if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 20)) return { 
                    nome: 'Áries', simbolo: '♈️', elemento: 'Fogo', regente: 'Marte',
                    cavaleiro: 'Mu de Áries ♈️', caracteristicas: 'Protetor, sábio e poderoso'
                };
                if ((mes === 4 && dia >= 21) || (mes === 5 && dia <= 20)) return { 
                    nome: 'Touro', simbolo: '♉️', elemento: 'Terra', regente: 'Vênus',
                    cavaleiro: 'Aldebaran de Touro ♉️', caracteristicas: 'Forte, leal e persistente'
                };
                if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return { 
                    nome: 'Gêmeos', simbolo: '♊️', elemento: 'Ar', regente: 'Mercúrio',
                    cavaleiro: 'Saga de Gêmeos ♊️', caracteristicas: 'Dualidade, inteligência e poder'
                };
                if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return { 
                    nome: 'Câncer', simbolo: '♋️', elemento: 'Água', regente: 'Lua',
                    cavaleiro: 'Máscara da Morte de Câncer ♋️', caracteristicas: 'Misterioso e estratégico'
                };
                if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return { 
                    nome: 'Leão', simbolo: '♌️', elemento: 'Fogo', regente: 'Sol',
                    cavaleiro: 'Aiolia de Leão ♌️', caracteristicas: 'Nobre, corajoso e justiceiro'
                };
                if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return { 
                    nome: 'Virgem', simbolo: '♍️', elemento: 'Terra', regente: 'Mercúrio',
                    cavaleiro: 'Shaka de Virgem ♍️', caracteristicas: 'O mais próximo dos deuses'
                };
                if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return { 
                    nome: 'Libra', simbolo: '♎️', elemento: 'Ar', regente: 'Vênus',
                    cavaleiro: 'Dohko de Libra ♎️', caracteristicas: 'Sábio, equilibrado e justo'
                };
                if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return { 
                    nome: 'Escorpião', simbolo: '♏️', elemento: 'Água', regente: 'Plutão',
                    cavaleiro: 'Milo de Escorpião ♏️', caracteristicas: 'Intenso, passionál e mortal'
                };
                if ((mes === 11 && dia >= 22) || (mes === 0 && dia <= 21)) return { 
                    nome: 'Sagitário', simbolo: '♐️', elemento: 'Fogo', regente: 'Júpiter',
                    cavaleiro: 'Aiolos de Sagitário ♐️', caracteristicas: 'Heróico, visionário e protetor'
                };
                if ((mes === 0 && dia >= 22) || (mes === 1 && dia <= 19)) return { 
                    nome: 'Capricórnio', simbolo: '♑️', elemento: 'Terra', regente: 'Saturno',
                    cavaleiro: 'Shura de Capricórnio ♑️', caracteristicas: 'Disciplinado e com espada divina'
                };
                if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return { 
                    nome: 'Aquário', simbolo: '♒️', elemento: 'Ar', regente: 'Urano',
                    cavaleiro: 'Camus de Aquário ♒️', caracteristicas: 'Calmo, frio e poderoso'
                };
                if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) return { 
                    nome: 'Peixes', simbolo: '♓️', elemento: 'Água', regente: 'Netuno',
                    cavaleiro: 'Afrodite de Peixes ♓️', caracteristicas: 'Belo, gracioso e mortal'
                };
                return null;
            };

            const idade = calcularIdade(nascimento);
            const info18 = calcularFaltam18(nascimento);
            const signo = calcularSigno(dia, mes);

            const feriados = [
                { data: '01-01-2025', nome: 'Ano Novo 🎉' },
                { data: '03-04-2025', nome: 'Carnaval 🎭' },
                { data: '18-04-2025', nome: 'Sexta-feira Santa ✝️' },
                { data: '21-04-2025', nome: 'Tiradentes 🇧🇷' },
                { data: '01-05-2025', nome: 'Dia do Trabalho 💼' },
                { data: '19-06-2025', nome: 'Corpus Christi ✝️' },
                { data: '07-09-2025', nome: 'Independência do Brasil 🇧🇷' },
                { data: '12-10-2025', nome: 'Nossa Senhora Aparecida ⛪' },
                { data: '02-11-2025', nome: 'Finados 🕯️' },
                { data: '15-11-2025', nome: 'Proclamação da República 🇧🇷' },
                { data: '25-12-2025', nome: 'Natal 🎄' }
            ];

            let resposta = `*🧬 PERFIL COMPLETO*

*🎂 Data de nascimento:* ${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${ano}

*⏳ Idade atual:*
— Anos: ${idade.anos} anos
— Meses: ${idade.meses} meses  
— Dias: ${idade.dias} dias
— Segundos: ${idade.segundos.toLocaleString('pt-BR')}

*🔞 Maioridade:*`;

            if (info18.jaFez18) {
                resposta += `
— Status: ✅ Já é maior de idade
— Data dos 18 anos: ${info18.data18.toLocaleDateString('pt-BR')}`;
            } else {
                resposta += `
— Status: ⏳ Ainda não completou 18 anos
— Faltam: ${info18.anos} anos, ${info18.meses} meses e ${info18.dias} dias
— Data dos 18 anos: ${info18.data18.toLocaleDateString('pt-BR')}`;
            }

            if (signo) {
                resposta += `

*♈ Signo Zodiacal:*
— Signo: ${signo.nome} ${signo.simbolo}
— Elemento: ${signo.elemento}
— Regente: ${signo.regente}
— Cavaleiro do Zodíaco: ${signo.cavaleiro}
— Características: ${signo.caracteristicas}`;
            }

            resposta += `

*📅 Próximos feriados em 2025:*
${feriados.map(f => `— *${f.data}*: ${f.nome}`).join('\n')}`;

            const ping = Date.now() - startProcess;
            resposta += `\n\n📶 Velocidade de resposta: ${ping}ms`;

            return await sendReply(resposta);

        } catch (error) {
            console.error('Erro no comando aniver:', error);
            await sendReact("❌");
            return await sendReply("❌ Ocorreu um erro ao processar a data. Verifique o formato e tente novamente.\nExemplo: _/aniver 15-05-1990_");
        }
    },
};
