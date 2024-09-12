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

//2 Função para mostrar a tela do histórico
function mostrarTelaHistorico() {
    showScreen('historico-medicoes');
    exibirHistoricoMedicoes(); // Atualiza a lista de medições
}

//3 Função para inicializar a página com base na URL ou exibir a tela padrão
function initializePage() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showScreen(hash);
    } else {
        showScreen('dashboard-screen'); // Tela padrão
    }
}

//4 Funções relacionadas às medições (page2.html)
function salvarMedicao(nivelGlicose, dataHora) {
    const medicao = { nivelGlicose, dataHora };
    let medicoes = JSON.parse(localStorage.getItem('medicoes')) || [];
    medicoes.push(medicao);
    localStorage.setItem('medicoes', JSON.stringify(medicoes));
    exibirUltimaMedicao();
}

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

function exibirHistoricoMedicoes() {
    const listaHistorico = document.getElementById('lista-historico');
    if (!listaHistorico) return;

    listaHistorico.innerHTML = '';
    const historico = JSON.parse(localStorage.getItem('medicoes')) || [];

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

//5 Inicialização das funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializePage();

    // Event listener para o formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Event listener para o formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener para o formulário de redefinição de senha
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }

    // Event listener para o formulário de medição (page2.html)
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

    // Inicializa a última medição e histórico se estiver na page2.html
    if (window.location.pathname.includes('page2.html')) {
        exibirUltimaMedicao();

        // Adiciona event listener para exibir histórico
        const historicoBtn = document.getElementById('historico-btn');
        if (historicoBtn) {
            historicoBtn.addEventListener('click', function() {
                showScreen('historico-medicoes');
            });
        }
    }
});

// Função para exibir o gráfico
function exibirGrafico() {
    const ctx = document.getElementById('graficoGlicose').getContext('2d');

    // Recupera o histórico do localStorage
    const userEmail = localStorage.getItem('loggedInUser');
    const historico = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];

    if (historico.length === 0) {
        alert('Nenhuma medição registrada para exibir no gráfico.');
        return;
    }

    const niveisGlicose = historico.map(medicao => medicao.nivelGlicose);
    const datas = historico.map(medicao => new Date(medicao.dataHora).toLocaleString());

    // Cria o gráfico usando Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datas, // Datas das medições
            datasets: [{
                label: 'Nível de Glicose (mg/dL)',
                data: niveisGlicose,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Data e Hora'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Nível de Glicose (mg/dL)'
                    }
                }
            }
        }
    });
}

// Event listener para o botão de gráfico
const graficoBtn = document.querySelector('button[onclick="showScreen(\'grafico-medicoes\')"]');
if (graficoBtn) {
    graficoBtn.addEventListener('click', function() {
        showScreen('grafico-medicoes');
        exibirGrafico(); // Chama a função para exibir o gráfico
    });
}

