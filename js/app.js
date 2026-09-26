/* =========================================================
   HOME / CATEGORIAS - SANTO BRIGADEIRO
========================================================= */

let featuredProducts = null;
let categoryButtons = [];
let searchInput = null;
let productsSection = null;
let productsSectionTitle = null;
let productsSectionKicker = null;
let orderStart = null;

let categoriaAtual = null;
let buscaAtual = "";

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

    if (buscaAtual) {
        productsSectionTitle.textContent = "Resultados da busca";
        if (productsSectionKicker) productsSectionKicker.textContent = "Busca";
        return;
    }

    productsSectionTitle.textContent = nomesCategoriasHome[categoriaAtual] || "Cardápio";
    if (productsSectionKicker) productsSectionKicker.textContent = "Escolha uma opção";
}

function mostrarHome() {
    categoriaAtual = null;
    buscaAtual = "";

    categoryButtons.forEach(item => item.classList.remove("active"));
    if (searchInput) searchInput.value = "";
    if (featuredProducts) featuredProducts.innerHTML = "";
    if (productsSection) productsSection.hidden = true;
    if (orderStart) orderStart.hidden = false;

    document.getElementById("homeTop")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function mostrarProdutos() {
    if (!featuredProducts || !productsSection) return;

    featuredProducts.innerHTML = "";
    productsSection.hidden = false;
    if (orderStart) orderStart.hidden = true;
    atualizarTituloProdutos();

    const produtosFiltrados = produtos.filter(produto => {
        const textoBusca = `${produto.nome} ${produto.descricao || ""}`.toLowerCase();

        if (buscaAtual) {
            return textoBusca.includes(buscaAtual);
        }

        return categoriaAtual && produto.categoria === categoriaAtual;
    });

    if (produtosFiltrados.length === 0) {
        featuredProducts.innerHTML = `
            <div class="empty-products">
                <span>🧁</span>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente outra categoria ou faça uma nova busca.</p>
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
    buscaAtual = "";
    if (searchInput) searchInput.value = "";

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

    if (categoriaAtual === categoria && !buscaAtual) {
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

function configurarBusca() {
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        buscaAtual = searchInput.value.toLowerCase().trim();

        if (!buscaAtual) {
            mostrarHome();
            return;
        }

        categoriaAtual = null;
        categoryButtons.forEach(item => item.classList.remove("active"));
        mostrarProdutos();
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
    searchInput = document.getElementById("searchInput");
    productsSection = document.getElementById("productsSection");
    productsSectionTitle = document.getElementById("productsSectionTitle");
    productsSectionKicker = document.getElementById("productsSectionKicker");
    orderStart = document.getElementById("orderStart");

    configurarCategorias();
    configurarBusca();
    configurarNavegacaoInferior();
    mostrarHome();
}

document.addEventListener("componentsLoaded", iniciarApp);
