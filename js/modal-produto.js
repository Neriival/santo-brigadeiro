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
const inspirationOption = document.getElementById("inspirationOption");
const inspirationImage = document.getElementById("inspirationImage");
const inspirationPreview = document.getElementById("inspirationPreview");
const inspirationPreviewImage = document.getElementById("inspirationPreviewImage");
const removeInspiration = document.getElementById("removeInspiration");
const modalTotal = document.getElementById("modalTotal");
const modalAddCart = document.getElementById("modalAddCart");
const quantidadeProdutoContainer = decreaseQuantity?.closest(".modal-option");

let produtoAtual = null;
let quantidadeAtual = 1;
let carrinho = [];
let inspirationFileName = "";
let inspirationObjectUrl = "";
let indiceFotoModal = 0;

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
    inspirationFileName = "";
    if (inspirationObjectUrl) URL.revokeObjectURL(inspirationObjectUrl);
    inspirationObjectUrl = "";
    if (inspirationImage) inspirationImage.value = "";
    if (inspirationPreview) inspirationPreview.hidden = true;
    if (inspirationOption) inspirationOption.hidden = produto.categoria !== "bolos";

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

    indiceFotoModal = 0;
    const fotosModal = produto.galeria?.length ? produto.galeria : (produto.imagem ? [produto.imagem] : []);
    modalProductImage.replaceChildren();
    if (fotosModal.length) {
        const imagem = document.createElement('img');
        imagem.src = fotosModal[0];
        imagem.alt = `Foto de ${produto.nome}`;
        imagem.id = 'fotoAtualModal';
        modalProductImage.append(imagem);
        if (fotosModal.length > 1) {
            const anterior = document.createElement('button');
            anterior.type = 'button'; anterior.className = 'galeria-seta galeria-anterior';
            anterior.textContent = '‹'; anterior.setAttribute('aria-label','Foto anterior');
            const proxima = document.createElement('button');
            proxima.type = 'button'; proxima.className = 'galeria-seta galeria-proxima';
            proxima.textContent = '›'; proxima.setAttribute('aria-label','Próxima foto');
            const contador = document.createElement('span');
            contador.className = 'galeria-contador';
            const atualizar = () => {
                imagem.src = fotosModal[indiceFotoModal];
                contador.textContent = `${indiceFotoModal + 1} / ${fotosModal.length}`;
            };
            anterior.addEventListener('click', () => {
                indiceFotoModal = (indiceFotoModal - 1 + fotosModal.length) % fotosModal.length;
                atualizar();
            });
            proxima.addEventListener('click', () => {
                indiceFotoModal = (indiceFotoModal + 1) % fotosModal.length;
                atualizar();
            });
            modalProductImage.append(anterior,proxima,contador);
            atualizar();
        }
    } else {
        const semFoto = document.createElement('div');
        semFoto.className = 'modal-no-image'; semFoto.textContent = iconeModal;
        modalProductImage.append(semFoto);
    }

    if (quantidadeProdutoContainer) {
        quantidadeProdutoContainer.style.display = (!produto.origemBanco && (["doces", "salgados"].includes(produto.categoria) || produto.tipoConfiguracao === "kit-festa")) ? "none" : "";
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

    if (produtoAtual.origemBanco) return;

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

    if (produtoAtual.origemBanco) return Number(produtoAtual.preco || 0);
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
    const multiplicador = (!produtoAtual.origemBanco && (["doces", "salgados"].includes(produtoAtual.categoria) || produtoAtual.tipoConfiguracao === "kit-festa")) ? 1 : quantidadeAtual;
    modalTotal.textContent = formatarPreco(obterPrecoAtual() * multiplicador);
}

increaseQuantity?.addEventListener("click", () => {
    if (!produtoAtual?.origemBanco && (["doces", "salgados"].includes(produtoAtual?.categoria) || produtoAtual?.tipoConfiguracao === "kit-festa")) return;
    quantidadeAtual++;
    productQuantity.textContent = quantidadeAtual;
    atualizarTotal();
});

decreaseQuantity?.addEventListener("click", () => {
    if ((!produtoAtual?.origemBanco && (["doces", "salgados"].includes(produtoAtual?.categoria) || produtoAtual?.tipoConfiguracao === "kit-festa")) || quantidadeAtual <= 1) return;
    quantidadeAtual--;
    productQuantity.textContent = quantidadeAtual;
    atualizarTotal();
});

modalAddCart?.addEventListener("click", () => {
    if (!produtoAtual) return;

    if (produtoAtual.origemBanco) {
        const observacao = productObservation?.value.trim() || '';
        if (produtoAtual.categoria === 'topos' && !observacao) {
            alert('Descreva como deseja seu topo personalizado.');
            productObservation?.focus(); return;
        }
        const preco = Number(produtoAtual.preco);
        carrinho.push({
            id: Date.now(), produtoId: produtoAtual.id, nome: produtoAtual.nome,
            categoria: produtoAtual.categoria, quantidade: quantidadeAtual,
            precoUnitario: preco, total: preco * quantidadeAtual,
            tamanho: null, massa: null, recheios: [], observacao,
            temInspiracao: Boolean(inspirationFileName),
            nomeArquivoInspiracao: inspirationFileName || null
        });
        atualizarContadorCarrinho();
        alert('Produto adicionado ao carrinho!');
        fecharProduto(); return;
    }

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
        planoRecheio: dadosBolo?.planoRecheio || null,
        observacao,
        temInspiracao: Boolean(inspirationFileName),
        nomeArquivoInspiracao: inspirationFileName || null
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


/* V11 - FOTO DE INSPIRAÇÃO E FLUXO GUIADO */
inspirationImage?.addEventListener("change", () => {
    const arquivo = inspirationImage.files?.[0];
    if (!arquivo) return;
    inspirationFileName = arquivo.name;
    if (inspirationObjectUrl) URL.revokeObjectURL(inspirationObjectUrl);
    inspirationObjectUrl = URL.createObjectURL(arquivo);
    if (inspirationPreviewImage) inspirationPreviewImage.src = inspirationObjectUrl;
    if (inspirationPreview) inspirationPreview.hidden = false;
    setTimeout(() => productObservation?.scrollIntoView({behavior:"smooth", block:"center"}), 250);
});
removeInspiration?.addEventListener("click", () => {
    inspirationFileName = "";
    if (inspirationObjectUrl) URL.revokeObjectURL(inspirationObjectUrl);
    inspirationObjectUrl = "";
    if (inspirationImage) inspirationImage.value = "";
    if (inspirationPreview) inspirationPreview.hidden = true;
});

// Nas opções que recriam o conteúdo (doces, salgados e kits), avança suavemente
// para a próxima etapa sem impedir que o cliente volte e altere escolhas anteriores.
productOptions?.addEventListener("click", event => {
    const alvo = event.target.closest("button");
    if (!alvo || alvo.matches("[id$='Decrease'], [id$='Increase']")) return;
    const secao = alvo.closest(".doces-section, .salgados-section, .kit-section");
    if (!secao) return;
    const indice = [...secao.parentElement.children].indexOf(secao);
    setTimeout(() => {
        const secoes = productOptions.querySelectorAll(".doces-section, .salgados-section, .kit-section");
        const proxima = secoes[indice + 1];
        proxima?.scrollIntoView({behavior:"smooth", block:"center"});
    }, 220);
});
