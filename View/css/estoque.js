// Array para armazenar produtos do banco de dados
let produtos = [];

// Função para carregar produtos do banco de dados
async function carregarProdutos() {
    try {
// Aqui irei colocar o codigo para pedir uma requisição para o banco de dados para carregar os produtos
        


        
        produtos = [
            {
                id: 1,
                nome: 'Garrafa de Água 500ml',
                descricao: 'Água mineral gelada',
                preco: 4.50,
                imagem: './img/aguamineral.png'
            },
            {
                id: 2,
                nome: 'Garrafa de Coca-Cola 600ml',
                descricao: 'Refrigerante gelado',
                preco: 6.00,
                imagem: './img/garrafadecoca1.png'
            }
        ];
        
        // Renderizar produtos após carregar os produtos
        renderizarProdutos();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtos = [];
        renderizarProdutos();
    }
}

// Função para adicionar produtos
function adicionarProduto(produto) {
    produtos.push(produto);
    renderizarProdutos();
}

// Função para remover produtos
function removerProduto(id) {
    produtos = produtos.filter(produto => produto.id !== id);
    renderizarProdutos();
}

// Carrinho de compras
let carrinho = [];

// Elementos DOM
const produtosGrid = document.getElementById('produtos-grid');
const carrinhoItems = document.getElementById('carrinho-items');
const carrinhoCount = document.getElementById('carrinho-count');
const totalValor = document.getElementById('total-valor');
const btnFinalizar = document.getElementById('btn-finalizar');
const modalConfirmacao = document.getElementById('modal-confirmacao');
const modalTotalValor = document.getElementById('modal-total-valor');
const btnConfirmarCompra = document.getElementById('btn-confirmar-compra');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos(); // Carrega produtos do banco de dados
    atualizarCarrinho();
    configurarEventos();
});

// Renderizar produtos na loja
function renderizarProdutos() {
    produtosGrid.innerHTML = '';
    
    if (produtos.length === 0) {
        // Mostrar mensagem quando não há produtos
        const mensagemVazia = document.createElement('div');
        mensagemVazia.className = 'produtos-vazios';
        mensagemVazia.innerHTML = `
            <div class="mensagem-vazia">
                <i class="bi bi-box-seam" style="font-size: 48px; color: #003785; margin-bottom: 20px;"></i>
                <h3 style="color: #fff; margin-bottom: 10px;">Nenhum produto disponível</h3>
                <p style="color: #ccc; text-align: center;">
                    
                </p>
            </div>
        `;
        produtosGrid.appendChild(mensagemVazia);
        return;
    }
    
    produtos.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        const isImagePath = typeof produto.imagem === 'string' && /\.(png|jpe?g|svg|webp|gif)$/i.test(produto.imagem);
        const imagemHTML = isImagePath
            ? `<img src="${produto.imagem}" alt="${produto.nome}" style="max-width:100%; max-height:100%; object-fit:contain;" />`
            : (produto.imagem || '📦');
        produtoCard.innerHTML = `
            <div class="produto-imagem">${imagemHTML}</div>
            <div class="produto-nome">${produto.nome}</div>
            <div class="produto-descricao">${produto.descricao || 'Sem descrição'}</div>
            <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
            <button class="btn-adicionar" onclick="adicionarAoCarrinho(${produto.id})">
                <i class="bi bi-cart-plus"></i> Adicionar ao Carrinho
            </button>
        `;
        produtosGrid.appendChild(produtoCard);
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    mostrarFeedback('Produto adicionado ao carrinho!');
}

// Remover produto do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarCarrinho();
    mostrarFeedback('Produto removido do carrinho!');
}

// Atualizar quantidade de produto no carrinho
function atualizarQuantidade(produtoId, novaQuantidade) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            item.quantidade = novaQuantidade;
            atualizarCarrinho();
        }
    }
}

// Atualizar interface do carrinho
function atualizarCarrinho() {
    // Atualizar contador
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    carrinhoCount.textContent = totalItens;
    
    // Atualizar lista de itens
    if (carrinho.length === 0) {
        carrinhoItems.innerHTML = '<p class="carrinho-vazio">Carrinho vazio</p>';
    } else {
        carrinhoItems.innerHTML = '';
        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-nome">${item.nome}</div>
                    <div class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="item-controles">
                    <button class="btn-quantidade" onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1})">-</button>
                    <span class="quantidade">${item.quantidade}</span>
                    <button class="btn-quantidade" onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1})">+</button>
                    <button class="btn-remover" onclick="removerDoCarrinho(${item.id})" title="Remover item">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            carrinhoItems.appendChild(itemElement);
        });
    }
    
    // Atualizar total
    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    totalValor.textContent = total.toFixed(2).replace('.', ',');
    
    // Habilitar/desabilitar botão finalizar
    btnFinalizar.disabled = carrinho.length === 0;
}

// Configurar eventos
function configurarEventos() {
    // Botão finalizar compra
    btnFinalizar.addEventListener('click', function() {
        if (carrinho.length > 0) {
            const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
            modalTotalValor.textContent = total.toFixed(2).replace('.', ',');
            modalConfirmacao.showModal();
        }
    });
    
    // Botão confirmar compra
    btnConfirmarCompra.addEventListener('click', function() {
        finalizarCompra();
    });
    
    // Fechar modal
    const closeModalButtons = document.querySelectorAll('.close-modal, .btn-cancelar');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                const modal = document.getElementById(modalId);
                modal.close();
            }
        });
    });
    
    // Fechar modal clicando fora
    modalConfirmacao.addEventListener('click', function(e) {
        if (e.target === modalConfirmacao) {
            modalConfirmacao.close();
        }
    });
}

// Finalizar compra
function finalizarCompra() {
    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    // Simular processamento
    mostrarFeedback('Processando compra...');
    
    setTimeout(() => {
        alert(`Compra finalizada com sucesso!\n\nTotal de itens: ${totalItens}\nValor total: R$ ${total.toFixed(2).replace('.', ',')}\n\nObrigado pela sua compra!`);
        
        // Limpar carrinho
        carrinho = [];
        atualizarCarrinho();
        
        // Fechar modal
        modalConfirmacao.close();
        
        mostrarFeedback('Compra realizada com sucesso!');
    }, 1500);
}

// Mostrar feedback visual
function mostrarFeedback(mensagem) {
    // Criar elemento de feedback
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
    
    // Animar entrada
    setTimeout(() => {
        feedback.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 3000);
}

// Funções globais para uso nos eventos HTML
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidade = atualizarQuantidade;
window.adicionarProduto = adicionarProduto;
window.removerProduto = removerProduto;
window.carregarProdutos = carregarProdutos;
