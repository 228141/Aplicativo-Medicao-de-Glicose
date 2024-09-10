// scripts.js

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
        // Redireciona para page2.html após o login
        window.location.href = 'page2.html';
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

// Funções relacionadas às medições (page2.html)
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
            });
        }
    }
});

// Função para salvar os dados do usuário no local storage
function saveUserData() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password === confirmPassword) {
        // Criar um objeto com os dados do usuário
        const user = {
            username: username,
            email: email,
            password: password
        };

        // Salvar no local storage usando o e-mail como chave
        localStorage.setItem(email, JSON.stringify(user));
        alert('Usuário cadastrado com sucesso!');

        // Limpar o formulário
        document.getElementById('register-form').reset();
        // Retornar para a tela inicial
        showScreen('dashboard-screen');
    } else {
        alert('As senhas não coincidem. Tente novamente.');
    }
}

// Adicionar evento de submissão ao formulário de cadastro
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    saveUserData();
});

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Criação do objeto com os dados do usuário
    const userData = {
        username: username,
        email: email,
        password: password
    };

    // Salvando no localStorage usando o email como chave
    localStorage.setItem(email, JSON.stringify(userData));
    
    alert('Cadastro realizado com sucesso!');
    showScreen('dashboard-screen'); // Volta para a tela inicial
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Buscar os dados do usuário no localStorage
    const storedUser = localStorage.getItem(email);

    if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Verifica se a senha está correta
        if (userData.password === password) {
            alert('Login bem-sucedido!');
            // Redireciona para a próxima tela, por exemplo
            showScreen('page2');
        } else {
            alert('Senha incorreta!');
        }
    } else {
        alert('Usuário não encontrado!');
    }
});

document.getElementById('reset-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    // Busca o usuário pelo e-mail
    const storedUser = localStorage.getItem(email);

    if (storedUser) {
        // Lógica para redefinir senha (pode ser pedida uma nova senha)
        const newPassword = prompt("Digite a nova senha:");
        const userData = JSON.parse(storedUser);
        userData.password = newPassword;
        
        // Atualiza no localStorage
        localStorage.setItem(email, JSON.stringify(userData));
        
        alert('Senha redefinida com sucesso!');
        showScreen('dashboard-screen');
    } else {
        alert('Usuário não encontrado!');
    }
});
