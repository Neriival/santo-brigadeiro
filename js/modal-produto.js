/* =========================================================
   MODAL DE PRODUTO - SANTO BRIGADEIRO
========================================================= */

const productModalOverlay = document.getElementById("productModalOverlay");
const modalClose = document.getElementById("modalClose");
const modalProductImage = document.getElementById("modalProductImage");
const modalCategory = document.getElementById("modalCategory");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductPrice = document.getElementById("modalProductPrice");
const productOptions = document.getElementById("productOptions");
const decreaseQuantity = document.getElementById("decreaseQuantity");
const productQuantity = document.getElementById("productQuantity");
const increaseQuantity = document.getElementById("increaseQuantity");
const productObservation = document.getElementById("productObservation");
const productObservationLabel = document.getElementById("productObservationLabel");
const modalTotal = document.getElementById("modalTotal");
const modalAddCart = document.getElementById("modalAddCart");
const quantidadeProdutoContainer = decreaseQuantity?.closest(".modal-option");

let produtoAtual = null;
let quantidadeAtual = 1;
let carrinho = [];

function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function nomeCategoria(categoria) {
    const nomes = {
        bolos: "Bolos",
        kits: "Kits",
        doces: "Doces",
        salgados: "Salgados",
        topos: "Topos Personalizados"
    };
    return nomes[categoria] || categoria || "Produto";
}

function abrirProduto(id) {
    const produto = produtos.find(item => item.id === id);
    if (!produto) return;

    produtoAtual = produto;
    quantidadeAtual = 1;

    modalCategory.textContent = nomeCategoria(produto.categoria);
    modalProductName.textContent = produto.nome;
    modalProductDescription.textContent = produto.descricao || "";
    productQuantity.textContent = "1";

    if (productObservation) {
        productObservation.value = "";
        const topo = produto.categoria === "topos";
        productObservation.required = topo;
        if (topo) {
            productObservation.placeholder =
                "Ex: Nome Joaquim, 1 ano, tema Homem-Aranha, cores azul e vermelho...";

            productObservationLabel.innerHTML =
                "Descreva como deseja seu topo <strong>*</strong>";

        } else if (produto.categoria === "doces") {
            productObservation.placeholder =
                "Ex: cores das forminhas, detalhes do pedido ou alguma preferência...";

            productObservationLabel.textContent =
                "Alguma observação?";

        } else if (produto.categoria === "salgados") {
            productObservation.placeholder =
                "Ex: alguma observação sobre o pedido...";

            productObservationLabel.textContent =
                "Alguma observação?";

        } else if (produto.tipoConfiguracao === "kit-festa") {
            productObservation.placeholder =
                "Ex: detalhes da decoração, cores da festa ou alguma preferência...";

            productObservationLabel.textContent =
                "Alguma observação?";

        } else if (produto.categoria === "bolos") {
            productObservation.placeholder =
                "Ex: escrever nome no bolo, detalhes da decoração...";

            productObservationLabel.textContent =
                "Alguma observação?";

        } else {
            productObservation.placeholder =
                "Ex: detalhes ou alguma preferência para o pedido...";

            productObservationLabel.textContent =
                "Alguma observação?";
        }
    }

    const iconesModal = { bolos: "🎂", doces: "🍬", salgados: "🥟", topos: "🎨" };
    const iconeModal = produto.categoria === "kits"
        ? (produto.tipoConfiguracao === "kit-festa" ? "🎉" : "🎈")
        : (iconesModal[produto.categoria] || "🧁");

    modalProductImage.innerHTML = produto.imagem
        ? `<img src="${produto.imagem}" alt="${produto.nome}">`
        : `<div class="modal-no-image">${iconeModal}</div>`;

    if (quantidadeProdutoContainer) {
        quantidadeProdutoContainer.style.display = (["doces", "salgados"].includes(produto.categoria) || produto.tipoConfiguracao === "kit-festa") ? "none" : "";
    }

    criarOpcoesProduto();
    atualizarPrecoProduto();
    atualizarTotal();

    productModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function fecharProduto() {
    productModalOverlay?.classList.remove("active");
    document.body.style.overflow = "";
}

function criarOpcoesProduto() {
    productOptions.innerHTML = "";
    if (!produtoAtual) return;

    if (produtoAtual.categoria === "doces") {
        iniciarModalDoces(productOptions, produtoAtual, () => {
            atualizarPrecoProduto();
            atualizarTotal();
        });
        return;
    }

    if (produtoAtual.categoria === "salgados") {
        iniciarModalSalgados(productOptions, produtoAtual, () => {
            atualizarPrecoProduto();
            atualizarTotal();
        });
        return;
    }

    if (produtoAtual.tipoConfiguracao === "kit-festa") {
        iniciarModalKit(productOptions, produtoAtual, () => {
            atualizarPrecoProduto();
            atualizarTotal();
        });
        return;
    }

    if (produtoAtual.categoria === "bolos" && produtoAtual.tamanhos?.length) {
        iniciarModalBolo(productOptions, produtoAtual, () => {
            atualizarPrecoProduto();
            atualizarTotal();
        });
    }
}

function obterPrecoAtual() {
    if (!produtoAtual) return 0;

    if (produtoAtual.categoria === "doces") return Number(obterDadosDoces()?.preco || 0);
    if (produtoAtual.categoria === "salgados") return Number(obterDadosSalgados()?.preco || 0);
    if (produtoAtual.tipoConfiguracao === "kit-festa") return Number(obterDadosKit()?.preco || produtoAtual.preco || 0);

    if (produtoAtual.categoria === "bolos" && produtoAtual.tamanhos?.length) {
        return Number(obterDadosBolo()?.preco || produtoAtual.preco || 0);
    }

    return Number(produtoAtual.preco || 0);
}

function atualizarPrecoProduto() {
    if (modalProductPrice) modalProductPrice.textContent = formatarPreco(obterPrecoAtual());
}

function atualizarTotal() {
    if (!produtoAtual || !modalTotal) return;
    const multiplicador = (["doces", "salgados"].includes(produtoAtual.categoria) || produtoAtual.tipoConfiguracao === "kit-festa") ? 1 : quantidadeAtual;
    modalTotal.textContent = formatarPreco(obterPrecoAtual() * multiplicador);
}

increaseQuantity?.addEventListener("click", () => {
    if (["doces", "salgados"].includes(produtoAtual?.categoria) || produtoAtual?.tipoConfiguracao === "kit-festa") return;
    quantidadeAtual++;
    productQuantity.textContent = quantidadeAtual;
    atualizarTotal();
});

decreaseQuantity?.addEventListener("click", () => {
    if (["doces", "salgados"].includes(produtoAtual?.categoria) || produtoAtual?.tipoConfiguracao === "kit-festa" || quantidadeAtual <= 1) return;
    quantidadeAtual--;
    productQuantity.textContent = quantidadeAtual;
    atualizarTotal();
});

modalAddCart?.addEventListener("click", () => {
    if (!produtoAtual) return;

    if (produtoAtual.categoria === "doces") {
        if (!validarDoces()) return;

        const doces = obterDadosDoces();
        carrinho.push({
            id: Date.now(),
            produtoId: produtoAtual.id,
            nome: produtoAtual.nome,
            categoria: produtoAtual.categoria,
            quantidade: 1,
            precoUnitario: doces.preco,
            total: doces.preco,
            quantidadeDoces: doces.quantidadeDoces,
            linhaDoces: doces.linha,
            linhaDocesId: doces.linhaId,
            saboresDoces: doces.sabores,
            tamanho: null,
            massa: null,
            recheios: [],
            observacao: productObservation?.value.trim() || ""
        });

        atualizarContadorCarrinho();
        alert("Docinhos adicionados ao carrinho!");
        fecharProduto();
        return;
    }

    if (produtoAtual.categoria === "salgados") {
        if (!validarSalgados()) return;
        const salgados = obterDadosSalgados();
        carrinho.push({
            id: Date.now(), produtoId: produtoAtual.id, nome: produtoAtual.nome, categoria: produtoAtual.categoria,
            quantidade: 1, precoUnitario: salgados.preco, total: salgados.preco,
            quantidadeSalgados: salgados.quantidadeSalgados, linhaSalgados: salgados.linha, linhaSalgadosId: salgados.linhaId,
            saboresSalgados: salgados.sabores, preparoSalgados: salgados.preparo,
            tamanho: null, massa: null, recheios: [], observacao: productObservation?.value.trim() || ""
        });
        atualizarContadorCarrinho();
        alert("Salgados adicionados ao carrinho!");
        fecharProduto();
        return;
    }

    if (produtoAtual.tipoConfiguracao === "kit-festa") {
        if (!validarKitFesta()) return;
        const kit = obterDadosKit();
        carrinho.push({
            id: Date.now(),
            produtoId: produtoAtual.id,
            nome: `${produtoAtual.nome} - ${kit.kitNome}`,
            categoria: produtoAtual.categoria,
            tipoConfiguracao: "kit-festa",
            quantidade: 1,
            precoUnitario: kit.preco,
            total: kit.preco,
            kitNome: kit.kitNome,
            kitServe: kit.serve,
            kitBoloKg: kit.boloKg,
            kitDoces: kit.doces,
            kitSalgados: kit.salgados,
            massa: kit.massa,
            recheios: kit.recheios.map(nome => ({ nome, tipo: "comum" })),
            saboresDocesKit: kit.saboresDoces,
            saboresSalgadosKit: kit.saboresSalgados,
            observacao: productObservation?.value.trim() || ""
        });
        atualizarContadorCarrinho();
        alert("Kit Festa adicionado ao carrinho!");
        fecharProduto();
        return;
    }

    if (produtoAtual.categoria === "bolos" && produtoAtual.tamanhos?.length) {
        if (!validarBolo()) return;
    }

    const observacao = productObservation?.value.trim() || "";
    if (produtoAtual.categoria === "topos" && !observacao) {
        alert("Descreva como deseja o seu topo personalizado.");
        productObservation?.focus();
        return;
    }

    const preco = obterPrecoAtual();
    const dadosBolo = (produtoAtual.categoria === "bolos" && produtoAtual.tamanhos?.length)
        ? obterDadosBolo()
        : null;

    carrinho.push({
        id: Date.now(),
        produtoId: produtoAtual.id,
        nome: produtoAtual.nome,
        categoria: produtoAtual.categoria,
        quantidade: quantidadeAtual,
        precoUnitario: preco,
        total: preco * quantidadeAtual,
        tamanho: dadosBolo?.tamanho || null,
        massa: dadosBolo?.massa || null,
        recheios: dadosBolo?.recheios || [],
        observacao
    });

    atualizarContadorCarrinho();
    alert("Produto adicionado ao carrinho!");
    fecharProduto();
});

function atualizarContadorCarrinho() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;
    cartCount.textContent = carrinho.reduce((total, item) => total + Number(item.quantidade || 0), 0);
}

modalClose?.addEventListener("click", fecharProduto);
productModalOverlay?.addEventListener("click", event => {
    if (event.target === productModalOverlay) fecharProduto();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && productModalOverlay?.classList.contains("active")) fecharProduto();
});
