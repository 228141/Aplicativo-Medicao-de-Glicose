// Exibe o formulário de adição de medição
function mostrarFormularioMedição() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('formulario-medicao').style.display = 'block';
}

// Cancela a inserção de medição e retorna ao dashboard
function cancelarFormulario() {
    document.getElementById('formulario-medicao').reset();
    document.getElementById('formulario-medicao').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Exibe o histórico (a funcionalidade será expandida mais tarde)
function mostrarHistorico() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('historico').style.display = 'block';
}
