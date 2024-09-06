// Função para mostrar a tela desejada
function showScreen(screenId) {
    // Esconder todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });

    // Mostrar a tela selecionada
    const targetScreen = document.getElementById(screenId);
    targetScreen.classList.remove('hidden');
}

// Exibir a tela inicial ao carregar
document.addEventListener('DOMContentLoaded', () => {
    showScreen('welcome-screen');  // Definir a tela inicial para ser mostrada
    carregarMedicoes();
    exibirUltimaMedicao();
});

// Variáveis globais
let medicoes = [];

// Função para salvar uma nova medição
document.getElementById('form-medicao').addEventListener('submit', function(e) {
    e.preventDefault(); // Impedir o envio padrão do formulário

    // Capturar os valores do formulário
    const nivelGlicose = document.getElementById('nivel-glicose').value;
    const dataHora = document.getElementById('data-hora').value;
    
    // Criar objeto da medição
    const medicao = {
        nivel: nivelGlicose,
        dataHora: dataHora
    };
    
    // Adicionar a medição ao array de medições e salvar no localStorage
    medicoes.push(medicao);
    localStorage.setItem('medicoes', JSON.stringify(medicoes));

    // Atualizar a última medição exibida e voltar para a tela de "Última Medição"
    exibirUltimaMedicao();
    showScreen('ultima-medicao');
});

// Função para exibir a última medição
function exibirUltimaMedicao() {
    const medicaoAtualDiv = document.getElementById('medicao-atual');
    
    // Verificar se existem medições
    if (medicoes.length > 0) {
        const ultimaMedicao = medicoes[medicoes.length - 1];
        medicaoAtualDiv.innerHTML = `
            <p>Nível de Glicose: ${ultimaMedicao.nivel} mg/dL</p>
            <p>Data e Hora: ${new Date(ultimaMedicao.dataHora).toLocaleString()}</p>
        `;
    } else {
        medicaoAtualDiv.innerHTML = '<p>Nenhuma medição registrada.</p>';
    }
}

// Função para carregar as medições do localStorage ao iniciar
function carregarMedicoes() {
    if (localStorage.getItem('medicoes')) {
        medicoes = JSON.parse(localStorage.getItem('medicoes'));
    }
}

function showScreen(screenId) {
    // Esconder todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // Mostrar a tela selecionada
    const targetScreen = document.getElementById(screenId);
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
}

// Exibir a tela inicial ao carregar
document.addEventListener('DOMContentLoaded', () => {
    showScreen('welcome-screen');
});
