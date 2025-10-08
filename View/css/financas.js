// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarTransacoes(); // Carrega transações financeiras
    configurarEventos && configurarEventos();
});

// Mostrar feedback visual
function mostrarFeedback(mensagem) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    feedback.textContent = mensagem;
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 3000);
}

let transacoes = [];

// Elementos DOM do controle financeiro
const totalReceitas = document.getElementById('total-receitas');
const totalDespesas = document.getElementById('total-despesas');
const saldoTotal = document.getElementById('saldo-total');
const tabelaHistorico = document.getElementById('tabela-historico');

// Carregar transações do armazenamento local
function carregarTransacoes() {
    const transacoesSalvas = localStorage.getItem('transacoes-financeiras');
    if (transacoesSalvas) {
        transacoes = JSON.parse(transacoesSalvas);
    }
    atualizarResumoFinanceiro();
    renderizarHistorico();
}

// Salvar transações no armazenamento local
function salvarTransacoes() {
    localStorage.setItem('transacoes-financeiras', JSON.stringify(transacoes));
}

// Adicionar venda da loja
function adicionarVenda() {
    const produto = document.getElementById('produto-vendido').value;
    const valor = parseFloat(document.getElementById('valor-venda').value);
    const quantidade = parseInt(document.getElementById('quantidade-venda').value);

    if (!produto || !valor || !quantidade) {
        mostrarFeedback('Preencha todos os campos da venda!');
        return;
    }

    const transacao = {
        id: Date.now(),
        tipo: 'venda',
        descricao: `${produto} (${quantidade}x)`,
        valor: valor * quantidade,
        data: new Date().toISOString(),
        categoria: 'loja'
    };

    transacoes.push(transacao);
    salvarTransacoes();
    atualizarResumoFinanceiro();
    renderizarHistorico();
    limparFormularioVenda();
    mostrarFeedback('Venda adicionada com sucesso!');
}

// Adicionar receita da vaga
function adicionarReceitaVaga() {
    const vaga = document.getElementById('vaga-ocupada').value;
    const valor = parseFloat(document.getElementById('valor-vaga').value);
    const tempo = parseFloat(document.getElementById('tempo-vaga').value);

    if (!vaga || !valor || !tempo) {
        mostrarFeedback('Preencha todos os campos da vaga!');
        return;
    }

    const transacao = {
        id: Date.now(),
        tipo: 'vaga',
        descricao: `Vaga ${vaga} (${tempo}h)`,
        valor: valor,
        data: new Date().toISOString(),
        categoria: 'estacionamento'
    };

    transacoes.push(transacao);
    salvarTransacoes();
    atualizarResumoFinanceiro();
    renderizarHistorico();
    limparFormularioVaga();
    mostrarFeedback('Receita de vaga adicionada com sucesso!');
}

// Adicionar despesa
function adicionarDespesa() {
    const descricao = document.getElementById('descricao-despesa').value;
    const valor = parseFloat(document.getElementById('valor-despesa').value);
    const categoria = document.getElementById('categoria-despesa').value;

    if (!descricao || !valor || !categoria) {
        mostrarFeedback('Preencha todos os campos da despesa!');
        return;
    }

    const transacao = {
        id: Date.now(),
        tipo: 'despesa',
        descricao: descricao,
        valor: valor,
        data: new Date().toISOString(),
        categoria: categoria
    };

    transacoes.push(transacao);
    salvarTransacoes();
    atualizarResumoFinanceiro();
    renderizarHistorico();
    limparFormularioDespesa();
    mostrarFeedback('Despesa adicionada com sucesso!');
}

// Atualizar resumo financeiro
function atualizarResumoFinanceiro() {
    const receitas = transacoes
        .filter(t => t.tipo === 'venda' || t.tipo === 'vaga')
        .reduce((total, t) => total + t.valor, 0);

    const despesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((total, t) => total + t.valor, 0);

    const saldo = receitas - despesas;

    totalReceitas.textContent = `R$ ${receitas.toFixed(2).replace('.', ',')}`;
    totalDespesas.textContent = `R$ ${despesas.toFixed(2).replace('.', ',')}`;
    saldoTotal.textContent = `R$ ${saldo.toFixed(2).replace('.', ',')}`;

    // Mudar cor do saldo baseado no valor
    if (saldo > 0) {
        saldoTotal.style.color = '#28a745';
    } else if (saldo < 0) {
        saldoTotal.style.color = '#dc3545';
    } else {
        saldoTotal.style.color = '#ffc107';
    }
}

// Renderizar histórico de transações
function renderizarHistorico() {
    if (transacoes.length === 0) {
        tabelaHistorico.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ccc;">
                <span style="font-size: 48px; margin-bottom: 15px; color: #003785;">📦</span>
                <p>Nenhuma transação registrada ainda.</p>
            </div>
        `;
        return;
    }

    const transacoesOrdenadas = [...transacoes].sort((a, b) => new Date(b.data) - new Date(a.data));

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    transacoesOrdenadas.forEach(transacao => {
        const data = new Date(transacao.data).toLocaleDateString('pt-BR');
        const hora = new Date(transacao.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const valorFormatado = `R$ ${transacao.valor.toFixed(2).replace('.', ',')}`;
        const badgeClass = `badge-${transacao.tipo}`;

        html += `
            <tr>
                <td>${data} ${hora}</td>
                <td><span class="badge-tipo ${badgeClass}">${transacao.tipo}</span></td>
                <td>${transacao.descricao}</td>
                <td>${transacao.categoria}</td>
                <td style="color: ${transacao.tipo === 'despesa' ? '#dc3545' : '#28a745'}">${valorFormatado}</td>
                <td>
                    <button onclick="removerTransacao(${transacao.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    tabelaHistorico.innerHTML = html;
}

// Remover transação
function removerTransacao(id) {
    if (confirm('Tem certeza que deseja remover esta transação?')) {
        transacoes = transacoes.filter(t => t.id !== id);
        salvarTransacoes();
        atualizarResumoFinanceiro();
        renderizarHistorico();
        mostrarFeedback('Transação removida com sucesso!');
    }
}

// Filtrar histórico
function filtrarHistorico() {
    const tipoFiltro = document.getElementById('filtro-tipo').value;
    const dataFiltro = document.getElementById('filtro-data').value;

    let transacoesFiltradas = [...transacoes];

    if (tipoFiltro) {
        transacoesFiltradas = transacoesFiltradas.filter(t => t.tipo === tipoFiltro);
    }

    if (dataFiltro) {
        const dataFiltroObj = new Date(dataFiltro);
        transacoesFiltradas = transacoesFiltradas.filter(t => {
            const dataTransacao = new Date(t.data);
            return dataTransacao.toDateString() === dataFiltroObj.toDateString();
        });
    }

    if (transacoesFiltradas.length === 0) {
        tabelaHistorico.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ccc;">
                <span style="font-size: 48px; margin-bottom: 15px; color: #003785;">🔍</span>
                <p>Nenhuma transação encontrada com os filtros aplicados.</p>
            </div>
        `;
        return;
    }

    const transacoesOrdenadas = transacoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    transacoesOrdenadas.forEach(transacao => {
        const data = new Date(transacao.data).toLocaleDateString('pt-BR');
        const hora = new Date(transacao.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const valorFormatado = `R$ ${transacao.valor.toFixed(2).replace('.', ',')}`;
        const badgeClass = `badge-${transacao.tipo}`;

        html += `
            <tr>
                <td>${data} ${hora}</td>
                <td><span class="badge-tipo ${badgeClass}">${transacao.tipo}</span></td>
                <td>${transacao.descricao}</td>
                <td>${transacao.categoria}</td>
                <td style="color: ${transacao.tipo === 'despesa' ? '#dc3545' : '#28a745'}">${valorFormatado}</td>
                <td>
                    <button onclick="removerTransacao(${transacao.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    tabelaHistorico.innerHTML = html;
}

// Limpar a opção filtro
function limparFiltros() {
    document.getElementById('filtro-tipo').value = '';
    document.getElementById('filtro-data').value = '';
    renderizarHistorico();
}

// Limpar formulários de venda
function limparFormularioVenda() {
    document.getElementById('produto-vendido').value = '';
    document.getElementById('valor-venda').value = '';
    document.getElementById('quantidade-venda').value = '';
}

function limparFormularioVaga() {
    document.getElementById('vaga-ocupada').value = '';
    document.getElementById('valor-vaga').value = '';
    document.getElementById('tempo-vaga').value = '';
}

function limparFormularioDespesa() {
    document.getElementById('descricao-despesa').value = '';
    document.getElementById('valor-despesa').value = '';
    document.getElementById('categoria-despesa').value = '';
}

// Gerar relatórios
function gerarRelatorioDiario() {
    const hoje = new Date().toISOString().split('T')[0];
    const transacoesHoje = transacoes.filter(t => t.data.startsWith(hoje));

    if (transacoesHoje.length === 0) {
        alert('Nenhuma transação registrada hoje.');
        return;
    }

    const receitas = transacoesHoje.filter(t => t.tipo === 'venda' || t.tipo === 'vaga').reduce((total, t) => total + t.valor, 0);
    const despesas = transacoesHoje.filter(t => t.tipo === 'despesa').reduce((total, t) => total + t.valor, 0);

    const relatorio = `
RELATÓRIO DIÁRIO - ${new Date().toLocaleDateString('pt-BR')}

Receitas: R$ ${receitas.toFixed(2).replace('.', ',')}
Despesas: R$ ${despesas.toFixed(2).replace('.', ',')}
Saldo: R$ ${(receitas - despesas).toFixed(2).replace('.', ',')}

Total de transações: ${transacoesHoje.length}
    `;

    alert(relatorio);
}

function gerarRelatorioMensal() {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    const transacoesMes = transacoes.filter(t => {
        const dataTransacao = new Date(t.data);
        return dataTransacao.getMonth() === mesAtual && dataTransacao.getFullYear() === anoAtual;
    });

    if (transacoesMes.length === 0) {
        alert('Nenhuma transação registrada este mês.');
        return;
    }

    const receitas = transacoesMes.filter(t => t.tipo === 'venda' || t.tipo === 'vaga').reduce((total, t) => total + t.valor, 0);
    const despesas = transacoesMes.filter(t => t.tipo === 'despesa').reduce((total, t) => total + t.valor, 0);

    const relatorio = `
RELATÓRIO MENSAL - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}

Receitas: R$ ${receitas.toFixed(2).replace('.', ',')}
Despesas: R$ ${despesas.toFixed(2).replace('.', ',')}
Saldo: R$ ${(receitas - despesas).toFixed(2).replace('.', ',')}

Total de transações: ${transacoesMes.length}
    `;

    alert(relatorio);
}

function exportarDados() {
    const dados = {
        transacoes: transacoes,
        resumo: {
            receitas: transacoes.filter(t => t.tipo === 'venda' || t.tipo === 'vaga').reduce((total, t) => total + t.valor, 0),
            despesas: transacoes.filter(t => t.tipo === 'despesa').reduce((total, t) => total + t.valor, 0),
            saldo: transacoes.filter(t => t.tipo === 'venda' || t.tipo === 'vaga').reduce((total, t) => total + t.valor, 0) - transacoes.filter(t => t.tipo === 'despesa').reduce((total, t) => total + t.valor, 0)
        },
        dataExportacao: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados-financeiros-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    mostrarFeedback('Dados exportados com sucesso!');
}

// Funções globais para uso nos eventos HTML
window.adicionarVenda = adicionarVenda;
window.adicionarReceitaVaga = adicionarReceitaVaga;
window.adicionarDespesa = adicionarDespesa;
window.filtrarHistorico = filtrarHistorico;
window.limparFiltros = limparFiltros;
window.removerTransacao = removerTransacao;
window.gerarRelatorioDiario = gerarRelatorioDiario;
window.gerarRelatorioMensal = gerarRelatorioMensal;
window.exportarDados = exportarDados;