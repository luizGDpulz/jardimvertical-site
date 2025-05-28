// Script para simular dados de monitoramento em tempo real
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const btnGerarDados = document.getElementById('btnGerarDados');
    const btnAtualizar = document.getElementById('btnAtualizar');
    const temperaturaValor = document.getElementById('temperaturaValor');
    const umidadeValor = document.getElementById('umidadeValor');
    const umidadeSoloValor = document.getElementById('umidadeSoloValor');
    const nivelLuzValor = document.getElementById('nivelLuzValor');
    const temperaturaAtualizacao = document.getElementById('temperaturaAtualizacao');
    const umidadeAtualizacao = document.getElementById('umidadeAtualizacao');
    const umidadeSoloAtualizacao = document.getElementById('umidadeSoloAtualizacao');
    const nivelLuzAtualizacao = document.getElementById('nivelLuzAtualizacao');
    const tabelaDados = document.getElementById('tabelaDados');
    const statusPlantas = document.getElementById('statusPlantas');
    
    // Dados simulados
    let dadosSimulados = {
        temperatura: [],
        umidade: [],
        umidadeSolo: [],
        nivelLuz: [],
        historico: []
    };
    
    // Cores para os gráficos
    const cores = {
        temperatura: {
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        umidade: {
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        },
        umidadeSolo: {
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        },
        nivelLuz: {
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgba(255, 205, 86, 0.2)'
        }
    };
    
    // Gráficos
    let graficoTempUmidade;
    let graficoSoloLuz;
    
    // Função para gerar data e hora atual formatada
    function getDataHoraAtual() {
        const agora = new Date();
        return agora.toLocaleString('pt-BR');
    }
    
    // Função para gerar número aleatório dentro de um intervalo
    function gerarNumeroAleatorio(min, max, decimais = 1) {
        const valor = Math.random() * (max - min) + min;
        return Number(valor.toFixed(decimais));
    }
    
    // Função para gerar dados simulados
    function gerarDadosSimulados() {
        // Limpar dados anteriores
        dadosSimulados = {
            temperatura: [],
            umidade: [],
            umidadeSolo: [],
            nivelLuz: [],
            historico: []
        };
        
        // Gerar dados para as últimas 24 horas (24 pontos)
        const horasAtras = 24;
        const agora = new Date();
        
        for (let i = horasAtras; i >= 0; i--) {
            const hora = new Date(agora);
            hora.setHours(agora.getHours() - i);
            const horaFormatada = hora.getHours() + ':00';
            
            // Gerar valores aleatórios para cada sensor
            const temperatura = gerarNumeroAleatorio(18, 30);
            const umidade = gerarNumeroAleatorio(40, 90);
            const umidadeSolo = gerarNumeroAleatorio(30, 80);
            const nivelLuz = gerarNumeroAleatorio(200, 1000, 0);
            
            // Adicionar aos arrays
            dadosSimulados.temperatura.push({x: horaFormatada, y: temperatura});
            dadosSimulados.umidade.push({x: horaFormatada, y: umidade});
            dadosSimulados.umidadeSolo.push({x: horaFormatada, y: umidadeSolo});
            dadosSimulados.nivelLuz.push({x: horaFormatada, y: nivelLuz});
            
            // Adicionar ao histórico (apenas alguns pontos para não sobrecarregar)
            if (i % 4 === 0) {
                const saudePlanta = avaliarSaudePlanta(temperatura, umidade, umidadeSolo, nivelLuz);
                dadosSimulados.historico.push({
                    sensor: `Sensor ${Math.floor(Math.random() * 5) + 1}`,
                    temperatura: temperatura,
                    umidade: umidade,
                    umidadeSolo: umidadeSolo,
                    nivelLuz: nivelLuz,
                    saudePlanta: saudePlanta,
                    dataHora: hora.toLocaleString('pt-BR')
                });
            }
        }
        
        // Atualizar valores atuais
        atualizarValoresAtuais();
        
        // Atualizar gráficos
        atualizarGraficos();
        
        // Atualizar tabela de histórico
        atualizarTabelaHistorico();
        
        // Atualizar status das plantas
        atualizarStatusPlantas();
    }
    
    // Função para avaliar a saúde da planta com base nos parâmetros
    function avaliarSaudePlanta(temperatura, umidade, umidadeSolo, nivelLuz) {
        // Valores ideais
        const idealTemp = {min: 20, max: 28};
        const idealUmidade = {min: 50, max: 80};
        const idealUmidadeSolo = {min: 40, max: 70};
        const idealNivelLuz = {min: 300, max: 800};
        
        // Calcular pontuação para cada parâmetro (0-100)
        let pontuacaoTemp = 100;
        let pontuacaoUmidade = 100;
        let pontuacaoSolo = 100;
        let pontuacaoLuz = 100;
        
        // Temperatura
        if (temperatura < idealTemp.min) {
            pontuacaoTemp -= (idealTemp.min - temperatura) * 10;
        } else if (temperatura > idealTemp.max) {
            pontuacaoTemp -= (temperatura - idealTemp.max) * 10;
        }
        
        // Umidade do ar
        if (umidade < idealUmidade.min) {
            pontuacaoUmidade -= (idealUmidade.min - umidade) * 2;
        } else if (umidade > idealUmidade.max) {
            pontuacaoUmidade -= (umidade - idealUmidade.max) * 2;
        }
        
        // Umidade do solo
        if (umidadeSolo < idealUmidadeSolo.min) {
            pontuacaoSolo -= (idealUmidadeSolo.min - umidadeSolo) * 3;
        } else if (umidadeSolo > idealUmidadeSolo.max) {
            pontuacaoSolo -= (umidadeSolo - idealUmidadeSolo.max) * 3;
        }
        
        // Nível de luz
        if (nivelLuz < idealNivelLuz.min) {
            pontuacaoLuz -= (idealNivelLuz.min - nivelLuz) / 10;
        } else if (nivelLuz > idealNivelLuz.max) {
            pontuacaoLuz -= (nivelLuz - idealNivelLuz.max) / 10;
        }
        
        // Limitar pontuações entre 0 e 100
        pontuacaoTemp = Math.max(0, Math.min(100, pontuacaoTemp));
        pontuacaoUmidade = Math.max(0, Math.min(100, pontuacaoUmidade));
        pontuacaoSolo = Math.max(0, Math.min(100, pontuacaoSolo));
        pontuacaoLuz = Math.max(0, Math.min(100, pontuacaoLuz));
        
        // Calcular média ponderada
        const pontuacaoFinal = (pontuacaoTemp * 0.3 + pontuacaoUmidade * 0.2 + pontuacaoSolo * 0.3 + pontuacaoLuz * 0.2);
        
        // Classificar saúde da planta
        if (pontuacaoFinal >= 90) return 'Excelente';
        if (pontuacaoFinal >= 75) return 'Boa';
        if (pontuacaoFinal >= 60) return 'Regular';
        if (pontuacaoFinal >= 40) return 'Precisa de Atenção';
        return 'Crítica';
    }
    
    // Função para atualizar os valores atuais exibidos
    function atualizarValoresAtuais() {
        const ultimoIndice = dadosSimulados.temperatura.length - 1;
        
        // Atualizar valores
        temperaturaValor.textContent = dadosSimulados.temperatura[ultimoIndice].y + '°C';
        umidadeValor.textContent = dadosSimulados.umidade[ultimoIndice].y + '%';
        umidadeSoloValor.textContent = dadosSimulados.umidadeSolo[ultimoIndice].y + '%';
        nivelLuzValor.textContent = dadosSimulados.nivelLuz[ultimoIndice].y;
        
        // Atualizar horários
        const horaAtual = getDataHoraAtual();
        temperaturaAtualizacao.textContent = horaAtual;
        umidadeAtualizacao.textContent = horaAtual;
        umidadeSoloAtualizacao.textContent = horaAtual;
        nivelLuzAtualizacao.textContent = horaAtual;
    }
    
    // Função para atualizar os gráficos
    function atualizarGraficos() {
        // Destruir gráficos existentes se houver
        if (graficoTempUmidade) graficoTempUmidade.destroy();
        if (graficoSoloLuz) graficoSoloLuz.destroy();
        
        // Criar gráfico de temperatura e umidade
        const ctxTempUmidade = document.getElementById('graficoTempUmidade').getContext('2d');
        graficoTempUmidade = new Chart(ctxTempUmidade, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: dadosSimulados.temperatura,
                        borderColor: cores.temperatura.borderColor,
                        backgroundColor: cores.temperatura.backgroundColor,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Umidade (%)',
                        data: dadosSimulados.umidade,
                        borderColor: cores.umidade.borderColor,
                        backgroundColor: cores.umidade.backgroundColor,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperatura (°C)'
                        },
                        min: 15,
                        max: 35
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Umidade (%)'
                        },
                        min: 30,
                        max: 100,
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        });
        
        // Criar gráfico de umidade do solo e nível de luz
        const ctxSoloLuz = document.getElementById('graficoSoloLuz').getContext('2d');
        graficoSoloLuz = new Chart(ctxSoloLuz, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Umidade do Solo (%)',
                        data: dadosSimulados.umidadeSolo,
                        borderColor: cores.umidadeSolo.borderColor,
                        backgroundColor: cores.umidadeSolo.backgroundColor,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Nível de Luz',
                        data: dadosSimulados.nivelLuz,
                        borderColor: cores.nivelLuz.borderColor,
                        backgroundColor: cores.nivelLuz.backgroundColor,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Umidade do Solo (%)'
                        },
                        min: 20,
                        max: 90
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Nível de Luz'
                        },
                        min: 0,
                        max: 1200,
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        });
    }
    
    // Função para atualizar a tabela de histórico
    function atualizarTabelaHistorico() {
        // Limpar tabela
        tabelaDados.innerHTML = '';
        
        // Adicionar cabeçalho
        const cabecalho = document.createElement('tr');
        cabecalho.innerHTML = `
            <th class="border px-4 py-2">Sensor</th>
            <th class="border px-4 py-2">Temperatura</th>
            <th class="border px-4 py-2">Umidade</th>
            <th class="border px-4 py-2">Umidade do Solo</th>
            <th class="border px-4 py-2">Nível de Luz</th>
            <th class="border px-4 py-2">Saúde da Planta</th>
            <th class="border px-4 py-2">Data/Hora</th>
        `;
        tabelaDados.appendChild(cabecalho);
        
        // Adicionar linhas de dados
        dadosSimulados.historico.forEach(registro => {
            const linha = document.createElement('tr');
            
            // Definir classe de cor com base na saúde da planta
            let classeSaude = '';
            switch(registro.saudePlanta) {
                case 'Excelente':
                    classeSaude = 'bg-green-100 text-green-800';
                    break;
                case 'Boa':
                    classeSaude = 'bg-green-50 text-green-600';
                    break;
                case 'Regular':
                    classeSaude = 'bg-yellow-100 text-yellow-800';
                    break;
                case 'Precisa de Atenção':
                    classeSaude = 'bg-orange-100 text-orange-800';
                    break;
                case 'Crítica':
                    classeSaude = 'bg-red-100 text-red-800';
                    break;
            }
            
            linha.innerHTML = `
                <td class="border px-4 py-2">${registro.sensor}</td>
                <td class="border px-4 py-2">${registro.temperatura}°C</td>
                <td class="border px-4 py-2">${registro.umidade}%</td>
                <td class="border px-4 py-2">${registro.umidadeSolo}%</td>
                <td class="border px-4 py-2">${registro.nivelLuz}</td>
                <td class="border px-4 py-2 ${classeSaude}">${registro.saudePlanta}</td>
                <td class="border px-4 py-2">${registro.dataHora}</td>
            `;
            tabelaDados.appendChild(linha);
        });
    }
    
    // Função para atualizar o status das plantas
    function atualizarStatusPlantas() {
        // Limpar conteúdo anterior
        statusPlantas.innerHTML = '';
        
        // Criar sensores simulados
        const sensores = [
            { id: 1, nome: 'Sensor 1 - Samambaias', localizacao: 'Parede Norte' },
            { id: 2, nome: 'Sensor 2 - Suculentas', localizacao: 'Parede Leste' },
            { id: 3, nome: 'Sensor 3 - Filodendros', localizacao: 'Parede Sul' },
            { id: 4, nome: 'Sensor 4 - Peperômias', localizacao: 'Parede Oeste' },
            { id: 5, nome: 'Sensor 5 - Syngonium', localizacao: 'Parede Central' }
        ];
        
        // Criar cards para cada sensor
        sensores.forEach(sensor => {
            // Gerar valores aleatórios para este sensor
            const temperatura = gerarNumeroAleatorio(18, 30);
            const umidade = gerarNumeroAleatorio(40, 90);
            const umidadeSolo = gerarNumeroAleatorio(30, 80);
            const nivelLuz = gerarNumeroAleatorio(200, 1000, 0);
            const saudePlanta = avaliarSaudePlanta(temperatura, umidade, umidadeSolo, nivelLuz);
            
            // Definir classe e ícone com base na saúde da planta
            let classeSaude = '';
            let icone = '';
            
            switch(saudePlanta) {
                case 'Excelente':
                    classeSaude = 'bg-green-100 border-green-500 text-green-800';
                    icone = '<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                    break;
                case 'Boa':
                    classeSaude = 'bg-green-50 border-green-400 text-green-700';
                    icone = '<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                    break;
                case 'Regular':
                    classeSaude = 'bg-yellow-100 border-yellow-500 text-yellow-800';
                    icone = '<svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
                    break;
                case 'Precisa de Atenção':
                    classeSaude = 'bg-orange-100 border-orange-500 text-orange-800';
                    icone = '<svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                    break;
                case 'Crítica':
                    classeSaude = 'bg-red-100 border-red-500 text-red-800';
                    icone = '<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                    break;
            }
            
            // Criar card
            const card = document.createElement('div');
            card.className = `border ${classeSaude} rounded-lg p-4 flex items-center`;
            card.innerHTML = `
                <div class="mr-4">
                    ${icone}
                </div>
                <div>
                    <h4 class="font-bold">${sensor.nome}</h4>
                    <p class="text-sm">${sensor.localizacao}</p>
                    <p class="mt-1"><strong>Status:</strong> ${saudePlanta}</p>
                    <div class="text-xs mt-1">
                        <span class="mr-2">T: ${temperatura}°C</span>
                        <span class="mr-2">U: ${umidade}%</span>
                        <span class="mr-2">Solo: ${umidadeSolo}%</span>
                        <span>Luz: ${nivelLuz}</span>
                    </div>
                </div>
            `;
            
            statusPlantas.appendChild(card);
        });
    }
    
    // Event listeners
    btnGerarDados.addEventListener('click', gerarDadosSimulados);
    btnAtualizar.addEventListener('click', function() {
        // Simular atualização apenas dos valores mais recentes
        if (dadosSimulados.temperatura.length > 0) {
            const ultimoIndice = dadosSimulados.temperatura.length - 1;
            
            // Atualizar com pequenas variações
            dadosSimulados.temperatura[ultimoIndice].y = gerarNumeroAleatorio(
                dadosSimulados.temperatura[ultimoIndice].y - 1,
                dadosSimulados.temperatura[ultimoIndice].y + 1
            );
            
            dadosSimulados.umidade[ultimoIndice].y = gerarNumeroAleatorio(
                dadosSimulados.umidade[ultimoIndice].y - 2,
                dadosSimulados.umidade[ultimoIndice].y + 2
            );
            
            dadosSimulados.umidadeSolo[ultimoIndice].y = gerarNumeroAleatorio(
                dadosSimulados.umidadeSolo[ultimoIndice].y - 1,
                dadosSimulados.umidadeSolo[ultimoIndice].y + 1
            );
            
            dadosSimulados.nivelLuz[ultimoIndice].y = gerarNumeroAleatorio(
                dadosSimulados.nivelLuz[ultimoIndice].y - 50,
                dadosSimulados.nivelLuz[ultimoIndice].y + 50,
                0
            );
            
            // Atualizar valores exibidos
            atualizarValoresAtuais();
            
            // Atualizar gráficos
            atualizarGraficos();
        } else {
            // Se não houver dados, gerar novos
            gerarDadosSimulados();
        }
    });
    
    // Inicializar com dados simulados
    gerarDadosSimulados();
});
