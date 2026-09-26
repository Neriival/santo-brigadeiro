/* =========================================================
   HOME / CATEGORIAS - SANTO BRIGADEIRO
========================================================= */

let featuredProducts = null;
let categoryButtons = [];
let productsSection = null;
let productsSectionTitle = null;
let productsSectionKicker = null;
let aboutKarina = null;

let categoriaAtual = null;

const WHATSAPP_ATENDIMENTO = "5513991618803";

const nomesCategoriasHome = {
    bolos: "Bolos",
    doces: "Docinhos",
    kits: "Kits Festa",
    salgados: "Salgados",
    topos: "Topos Personalizados"
};

const placeholdersProdutos = {
    bolos: "🎂",
    doces: "🍬",
    salgados: "🥟",
    topos: "🎨"
};

function formatarPrecoHome(preco) {
    return Number(preco || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterPlaceholderProduto(produto) {
    if (produto.categoria === "kits") {
        return produto.tipoConfiguracao === "kit-festa" ? "🎉" : "🎈";
    }
    return placeholdersProdutos[produto.categoria] || "🧁";
}

function criarCardProduto(produto) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.addEventListener("click", () => abrirProduto(produto.id));

    card.innerHTML = `
        <div class="product-image">
            ${produto.imagem
                ? `<img src="${produto.imagem}" alt="${produto.nome}">`
                : `<div class="no-image">${obterPlaceholderProduto(produto)}</div>`}
        </div>

        <div class="product-info">
            <span class="product-category">${nomesCategoriasHome[produto.categoria] || produto.categoria}</span>
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>

            <div class="product-footer">
                <strong>${formatarPrecoHome(produto.preco)}</strong>
                <button class="add-product" type="button" data-id="${produto.id}" aria-label="Abrir ${produto.nome}">+</button>
            </div>
        </div>
    `;

    return card;
}

function atualizarTituloProdutos() {
    if (!productsSectionTitle) return;

    productsSectionTitle.textContent = nomesCategoriasHome[categoriaAtual] || "Cardápio";
    if (productsSectionKicker) productsSectionKicker.textContent = "Escolha uma opção";
}

function mostrarHome() {
    categoriaAtual = null;
    categoryButtons.forEach(item => item.classList.remove("active"));
    if (featuredProducts) featuredProducts.innerHTML = "";
    if (productsSection) productsSection.hidden = true;
    if (aboutKarina) aboutKarina.hidden = false;

    document.getElementById("homeTop")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function mostrarProdutos() {
    if (!featuredProducts || !productsSection) return;

    featuredProducts.innerHTML = "";
    productsSection.hidden = false;
    if (aboutKarina) aboutKarina.hidden = true;
    atualizarTituloProdutos();

    const produtosFiltrados = produtos.filter(produto => {
        return categoriaAtual && produto.categoria === categoriaAtual;
    });

    if (produtosFiltrados.length === 0) {
        featuredProducts.innerHTML = `
            <div class="empty-products">
                <span>🧁</span>
                <h3>Nenhum produto encontrado</h3>
                <p>Escolha outra categoria para continuar.</p>
            </div>
        `;
        return;
    }

    produtosFiltrados.forEach(produto => {
        featuredProducts.appendChild(criarCardProduto(produto));
    });
}

function abrirCategoria(categoria, rolar = true) {
    categoriaAtual = categoria;

    categoryButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.category === categoria);
    });

    mostrarProdutos();

    if (rolar) {
        productsSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function selecionarCategoria(button) {
    const categoria = button.dataset.category;

    if (categoriaAtual === categoria) {
        mostrarHome();
        return;
    }

    abrirCategoria(categoria);
}

function configurarCategorias() {
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => selecionarCategoria(button));
    });

    document.querySelectorAll("[data-home-category]").forEach(button => {
        button.addEventListener("click", () => {
            abrirCategoria(button.dataset.homeCategory);
        });
    });
}

function configurarNavegacaoInferior() {
    const navHome = document.getElementById("navHome");
    const navWhatsapp = document.getElementById("navWhatsapp");

    navHome?.addEventListener("click", mostrarHome);

    navWhatsapp?.addEventListener("click", () => {
        const mensagem = "Olá! Vim pelo cardápio da Santo Brigadeiro e gostaria de tirar uma dúvida.";
        const url = `https://wa.me/${WHATSAPP_ATENDIMENTO}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    });
}

function iniciarApp() {
    featuredProducts = document.getElementById("featuredProducts");
    categoryButtons = document.querySelectorAll(".category-card");
    productsSection = document.getElementById("productsSection");
    productsSectionTitle = document.getElementById("productsSectionTitle");
    productsSectionKicker = document.getElementById("productsSectionKicker");
    aboutKarina = document.getElementById("aboutKarina");

    configurarCategorias();
    configurarNavegacaoInferior();
    mostrarHome();
}

document.addEventListener("componentsLoaded", iniciarApp);
