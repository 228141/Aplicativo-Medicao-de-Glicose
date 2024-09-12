

//1 Função para mostrar uma tela específica e ocultar as demais
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        } else {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        }
    });
}

//2 Função para exibir a última medição
function exibirUltimaMedicao() {
    const medicaoAtualDiv = document.getElementById('medicao-atual');
    if (!medicaoAtualDiv) return;
    
    let medicoes = JSON.parse(localStorage.getItem('medicoes')) || [];
    if (medicoes.length > 0) {
        const ultimaMedicao = medicoes[medicoes.length - 1];
        medicaoAtualDiv.innerHTML = `
            <p>Nível de Glicose: ${ultimaMedicao.nivelGlicose} mg/dL</p>
            <p>Data e Hora: ${new Date(ultimaMedicao.dataHora).toLocaleString()}</p>
        `;
    } else {
        medicaoAtualDiv.innerHTML = '<p>Nenhuma medição registrada.</p>';
    }
}

// Função para exibir o histórico de medições
function exibirHistoricoMedicoes() {
    const listaHistorico = document.getElementById('lista-historico');
    if (!listaHistorico) return;

    const userEmail = localStorage.getItem('loggedInUser'); // Obtém o e-mail do usuário logado
    listaHistorico.innerHTML = '';
    const historico = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];

    if (historico.length === 0) {
        listaHistorico.innerHTML = '<li>Nenhuma medição registrada.</li>';
    } else {
        historico.forEach((medicao, index) => {
            const item = document.createElement('li');
            item.textContent = `Medição ${index + 1}: Glicose: ${medicao.nivelGlicose} mg/dL - Data: ${new Date(medicao.dataHora).toLocaleString()}`;
            listaHistorico.appendChild(item);
        });
    }
}

// Função para mostrar a tela do histórico
function mostrarTelaHistorico() {
    showScreen('historico-medicoes');
    exibirHistoricoMedicoes(); // Atualiza a lista de medições
}

// Função para inicializar as funcionalidades da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a última medição e histórico se estiver na page2.html
    if (window.location.pathname.includes('page2.html')) {
        exibirUltimaMedicao();

        // Adiciona event listener para o formulário de medição
        const measurementForm = document.getElementById('form-medicao');
        if (measurementForm) {
            measurementForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const nivelGlicose = document.getElementById('nivel-glicose').value;
                const dataHora = document.getElementById('data-hora').value;

                salvarMedicao(nivelGlicose, dataHora);
                alert('Medição salva com sucesso!');
                showScreen('ultima-medicao');
            });
        }

        // Event listener para o botão "Registrar Nova Medição"
        const registrarBtn = document.querySelector('button[onclick="showScreen(\'registrar-medicao\')"]');
        if (registrarBtn) {
            registrarBtn.addEventListener('click', function() {
                showScreen('registrar-medicao');
            });
        }
    }
});
