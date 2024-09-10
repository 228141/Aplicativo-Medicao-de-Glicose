// Função para mostrar uma tela específica e ocultar as demais
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

// Função para inicializar a página com base na URL ou exibir a tela padrão
function initializePage() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showScreen(hash);
    } else {
        showScreen('dashboard-screen'); // Tela padrão
    }
}

// Função para registrar um novo usuário
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não correspondem!');
        return;
    }

    // Recupera usuários existentes do localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Verifica se o e-mail já está cadastrado
    if (users.some(user => user.email === email)) {
        alert('E-mail já cadastrado!');
        return;
    }

    // Adiciona o novo usuário
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Cadastro realizado com sucesso!');
    showScreen('dashboard-screen');
}

// Função para lidar com o login do usuário
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Login bem-sucedido!');
        localStorage.setItem('loggedInUser', email); // Salva o e-mail do usuário logado
        window.location.href = 'page2.html'; // Redireciona para page2.html após o login
    } else {
        alert('E-mail ou senha inválidos!');
    }
}

// Função para redefinir a senha do usuário
function handleResetPassword(event) {
    event.preventDefault();

    const email = document.getElementById('reset-email').value.trim();

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        // Para fins de demonstração, redefine a senha para 'newpassword'
        users[userIndex].password = 'newpassword';
        localStorage.setItem('users', JSON.stringify(users));
        alert('Senha redefinida para "newpassword". Por favor, faça login.');
        showScreen('login-screen');
    } else {
        alert('E-mail não encontrado!');
    }
}

// Função para salvar uma nova medição
function salvarMedicao(nivelGlicose, dataHora) {
    const medicao = { nivelGlicose, dataHora };
    const userEmail = localStorage.getItem('loggedInUser'); // Obtém o e-mail do usuário logado

    if (userEmail) {
        let medicoes = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];
        medicoes.push(medicao);
        localStorage.setItem(userEmail + '-measurements', JSON.stringify(medicoes));
        exibirUltimaMedicao(); // Atualiza a exibição da última medição
    } else {
        alert('Usuário não encontrado. Faça login primeiro.');
    }
}

// Função para exibir a última medição
function exibirUltimaMedicao() {
    const medicaoAtualDiv = document.getElementById('medicao-atual');
    if (!medicaoAtualDiv) return;

    const userEmail = localStorage.getItem('loggedInUser'); // Obtém o e-mail do usuário logado
    let medicoes = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];
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

// Inicialização das funcionalidades quando o DOM estiver carregado
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
                exibirHistoricoMedicoes(); // Atualiza a lista de medições
            });
        }
    }
});
