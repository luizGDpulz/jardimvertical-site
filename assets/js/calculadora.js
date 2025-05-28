// Script para simular calculadora de impacto ambiental
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tipoJardim = document.getElementById('tipoJardim');
    const areaJardim = document.getElementById('areaJardim');
    const areaValor = document.getElementById('areaValor');
    const btnCalcular = document.getElementById('btnCalcular');
    const resultadosContainer = document.getElementById('resultadosContainer');
    
    // Atualizar o valor exibido do slider
    areaJardim.addEventListener('input', function() {
        areaValor.textContent = this.value;
    });
    
    // Dados de referência para cálculos
    const dadosReferencia = {
        tipos: {
            'padrao': {
                nome: 'Padrão (Densidade média)',
                co2: 12.5,  // kg de CO2 absorvido por m² por ano
                temperatura: 3.2,  // redução de temperatura em °C
                agua: 0.8,  // economia de água em litros por m² por dia
                energia: 7.5,  // economia de energia em % para refrigeração
                poluentes: 0.9,  // kg de poluentes filtrados por m² por ano
                biodiversidade: 5  // espécies suportadas por m²
            },
            'intensivo': {
                nome: 'Intensivo (Alta densidade)',
                co2: 18.3,
                temperatura: 4.5,
                agua: 1.2,
                energia: 12.0,
                poluentes: 1.4,
                biodiversidade: 8
            },
            'extensivo': {
                nome: 'Extensivo (Baixa densidade)',
                co2: 8.7,
                temperatura: 2.1,
                agua: 0.5,
                energia: 5.0,
                poluentes: 0.6,
                biodiversidade: 3
            },
            'modular': {
                nome: 'Modular (Pré-fabricado)',
                co2: 10.2,
                temperatura: 2.8,
                agua: 0.7,
                energia: 6.5,
                poluentes: 0.8,
                biodiversidade: 4
            }
        }
    };
    
    // Função para calcular os benefícios ambientais
    function calcularBeneficios() {
        // Obter valores do formulário
        const tipo = tipoJardim.value;
        const area = parseInt(areaJardim.value);
        
        // Obter dados de referência para o tipo selecionado
        const dadosTipo = dadosReferencia.tipos[tipo];
        
        // Calcular benefícios
        const co2Anual = dadosTipo.co2 * area;
        const co25Anos = co2Anual * 5;
        const co210Anos = co2Anual * 10;
        
        const reducaoTemperatura = dadosTipo.temperatura;
        
        const economiaAguaDiaria = dadosTipo.agua * area;
        const economiaAguaMensal = economiaAguaDiaria * 30;
        const economiaAguaAnual = economiaAguaDiaria * 365;
        
        const economiaEnergia = dadosTipo.energia;
        
        const poluentesAnual = dadosTipo.poluentes * area;
        const poluentes5Anos = poluentesAnual * 5;
        
        const especiesSuportadas = Math.round(dadosTipo.biodiversidade * area);
        
        // Calcular equivalências para melhor compreensão
        const arvoresEquivalentes = Math.round(co2Anual / 22); // Uma árvore absorve cerca de 22kg de CO2 por ano
        const carrosEquivalentes = Math.round(co2Anual / 120); // Um carro emite cerca de 120kg de CO2 por 1000km
        const garrafasPlastico = Math.round(poluentesAnual * 200); // Aproximadamente 200 garrafas por kg de poluentes
        
        // Exibir resultados
        resultadosContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 class="text-xl font-bold mb-4">Resultados da Calculadora de Impacto Ambiental</h3>
                <p class="mb-4">Baseado em um jardim vertical <strong>${dadosTipo.nome}</strong> com área de <strong>${area} m²</strong>.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-green-50 rounded-lg p-4">
                        <h4 class="font-bold text-green-800 mb-2">Absorção de CO₂</h4>
                        <p class="text-gray-700 mb-1">Anual: <strong>${co2Anual.toFixed(1)} kg</strong></p>
                        <p class="text-gray-700 mb-1">Em 5 anos: <strong>${co25Anos.toFixed(1)} kg</strong></p>
                        <p class="text-gray-700">Em 10 anos: <strong>${co210Anos.toFixed(1)} kg</strong></p>
                        <p class="text-sm text-gray-600 mt-2">Equivalente a <strong>${arvoresEquivalentes} árvores</strong> ou <strong>${carrosEquivalentes} carros</strong> rodando 1.000 km.</p>
                    </div>
                    
                    <div class="bg-blue-50 rounded-lg p-4">
                        <h4 class="font-bold text-blue-800 mb-2">Economia de Água</h4>
                        <p class="text-gray-700 mb-1">Diária: <strong>${economiaAguaDiaria.toFixed(1)} litros</strong></p>
                        <p class="text-gray-700 mb-1">Mensal: <strong>${economiaAguaMensal.toFixed(1)} litros</strong></p>
                        <p class="text-gray-700">Anual: <strong>${economiaAguaAnual.toFixed(1)} litros</strong></p>
                        <p class="text-sm text-gray-600 mt-2">Através da redução da necessidade de irrigação e reuso de água.</p>
                    </div>
                    
                    <div class="bg-yellow-50 rounded-lg p-4">
                        <h4 class="font-bold text-yellow-800 mb-2">Redução de Temperatura</h4>
                        <p class="text-gray-700 mb-1">Redução média: <strong>${reducaoTemperatura.toFixed(1)}°C</strong></p>
                        <p class="text-gray-700">Economia de energia: <strong>${economiaEnergia.toFixed(1)}%</strong></p>
                        <p class="text-sm text-gray-600 mt-2">Na refrigeração do ambiente próximo ao jardim vertical.</p>
                    </div>
                    
                    <div class="bg-purple-50 rounded-lg p-4">
                        <h4 class="font-bold text-purple-800 mb-2">Filtragem de Poluentes</h4>
                        <p class="text-gray-700 mb-1">Anual: <strong>${poluentesAnual.toFixed(1)} kg</strong></p>
                        <p class="text-gray-700">Em 5 anos: <strong>${poluentes5Anos.toFixed(1)} kg</strong></p>
                        <p class="text-sm text-gray-600 mt-2">Equivalente a filtrar poluentes de <strong>${garrafasPlastico}</strong> garrafas plásticas.</p>
                    </div>
                </div>
                
                <div class="bg-indigo-50 rounded-lg p-4">
                    <h4 class="font-bold text-indigo-800 mb-2">Biodiversidade</h4>
                    <p class="text-gray-700">Seu jardim vertical pode suportar aproximadamente <strong>${especiesSuportadas} espécies</strong> diferentes de plantas, insetos e microorganismos.</p>
                    <p class="text-sm text-gray-600 mt-2">Contribuindo para a biodiversidade urbana e criando micro-habitats.</p>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-bold mb-4">Recomendações Personalizadas</h3>
                
                <div class="space-y-4">
                    <div class="flex items-start">
                        <svg class="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p>Para maximizar a absorção de CO₂, considere incluir plantas como <strong>Samambaia, Espada-de-São-Jorge e Jiboia</strong> em seu jardim vertical.</p>
                    </div>
                    
                    <div class="flex items-start">
                        <svg class="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p>Para melhorar a qualidade do ar interior, recomendamos <strong>Lírio da Paz, Espada-de-São-Jorge e Clorofito</strong>, conhecidas por sua capacidade de filtrar toxinas.</p>
                    </div>
                    
                    <div class="flex items-start">
                        <svg class="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p>Para maximizar o efeito de resfriamento, posicione seu jardim vertical em <strong>paredes que recebem sol direto</strong> durante a maior parte do dia.</p>
                    </div>
                    
                    <div class="flex items-start">
                        <svg class="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p>Considere implementar um <strong>sistema de coleta de água da chuva</strong> para irrigação, aumentando ainda mais os benefícios ambientais do seu jardim vertical.</p>
                    </div>
                </div>
            </div>
        `;
        
        // Exibir o container de resultados
        resultadosContainer.classList.remove('hidden');
        
        // Rolar suavemente até os resultados
        resultadosContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Event listener para o botão de calcular
    btnCalcular.addEventListener('click', calcularBeneficios);
});
