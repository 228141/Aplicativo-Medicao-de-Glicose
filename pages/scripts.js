// Variáveis globais
let medicoes = [];

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

// Função para carregar as medições do localStorage ao iniciar
function carregarMedicoes() {
    if (localStorage.getItem('medicoes')) {
        medicoes = JSON.parse(localStorage.getItem('medicoes'));
    }
}

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

// Exibir a tela inicial ao carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarMedicoes(); // Carregar medições salvas
    exibirUltimaMedicao(); // Exibir última medição
    showScreen('welcome-screen');  // Exibir tela de boas-vindas por padrão
});

    // Verifica o hash da URL e abre a tela correspondente
    const hash = window.location.hash.substring(1);
    if (hash) {
        showScreen(hash);
    } else {
        showScreen('welcome-screen');  // Tela padrão
};

document.addEventListener('DOMContentLoaded', function() {
    // Função para trocar de tela
    function showScreen(screenId) {
        // Seleciona todas as telas com a classe 'screen'
        const screens = document.querySelectorAll('.screen');

        // Oculta todas as telas
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        // Exibe a tela selecionada
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        } else {
            console.error(`Tela com ID "${screenId}" não encontrada.`);
        }
    }

    // Expor a função globalmente para o HTML
    window.showScreen = showScreen;
});

// Espera o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {

    // Função para exibir a tela selecionada e ocultar as demais
    function showScreen(screenId) {
        // Seleciona todas as telas com a classe 'screen'
        const screens = document.querySelectorAll('.screen');

        // Oculta todas as telas
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        // Exibe a tela com o ID fornecido
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        } else {
            console.error(`A tela com ID "${screenId}" não foi encontrada.`);
        }
    }

    // Expor a função showScreen para poder ser usada no HTML
    window.showScreen = showScreen;
});

function showScreen(screenId) {
    console.log(`Exibindo a tela: ${screenId}`);
    const screens = document.querySelectorAll('.screen');

    screens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
    } else {
        console.error(`A tela com ID "${screenId}" não foi encontrada.`);
    }
}

