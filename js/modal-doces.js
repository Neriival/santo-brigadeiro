/* =========================================================
   DOCINHOS - SANTO BRIGADEIRO
   Lógica isolada das opções de doces.
========================================================= */

let docesProdutoAtual = null;
let docesQuantidade = 25;
let docesLinhaSelecionada = "comum";
let docesSaboresSelecionados = [];
let docesContainer = null;
let docesAoAlterar = null;

function formatarPrecoDoces(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterMaxSaboresDoces() {
    if (!docesProdutoAtual) return 1;

    const regra = (docesProdutoAtual.regrasSabores || []).find(item => {
        const minimoOk = docesQuantidade >= item.quantidadeMinima;
        const maximoOk = item.quantidadeMaxima === null || docesQuantidade <= item.quantidadeMaxima;
        return minimoOk && maximoOk;
    });

    return regra ? regra.maxSabores : 1;
}

function obterLinhaDocesAtual() {
    return docesProdutoAtual?.linhasDoces?.[docesLinhaSelecionada] || null;
}

function calcularPrecoDoces() {
    const linha = obterLinhaDocesAtual();
    if (!linha) return 0;
    return Number(linha.precoCento || 0) * (docesQuantidade / 100);
}

function obterDadosDoces() {
    const linha = obterLinhaDocesAtual();

    return {
        quantidadeDoces: docesQuantidade,
        linhaId: docesLinhaSelecionada,
        linha: linha?.nome || "",
        sabores: [...docesSaboresSelecionados],
        maxSabores: obterMaxSaboresDoces(),
        preco: calcularPrecoDoces()
    };
}

function validarDoces() {
    if (!docesProdutoAtual) return false;

    if (docesSaboresSelecionados.length === 0) {
        alert("Escolha pelo menos 1 sabor de docinho.");
        return false;
    }

    return true;
}

function notificarAlteracaoDoces() {
    if (typeof docesAoAlterar === "function") {
        docesAoAlterar(obterDadosDoces());
    }
}

function renderizarModalDoces() {
    if (!docesContainer || !docesProdutoAtual) return;

    const linha = obterLinhaDocesAtual();
    const maxSabores = obterMaxSaboresDoces();
    const linhas = docesProdutoAtual.linhasDoces || {};

    docesContainer.innerHTML = `
        <div class="doces-options">
            <div class="doces-section">
                <div class="doces-section-title">
                    <div>
                        <h3>Quantidade de docinhos</h3>
                        <p>Escolha de 25 em 25 unidades</p>
                    </div>
                </div>

                <div class="doces-quantity">
                    <button type="button" class="doces-quantity-button" id="docesDecrease">−</button>
                    <div class="doces-quantity-value">
                        <strong>${docesQuantidade}</strong>
                        <span>doces</span>
                    </div>
                    <button type="button" class="doces-quantity-button" id="docesIncrease">+</button>
                </div>

                <div class="doces-flavor-limit">
                    Você pode escolher até <strong>${maxSabores} ${maxSabores === 1 ? "sabor" : "sabores"}</strong>
                </div>
            </div>

            <div class="doces-section">
                <div class="doces-section-title">
                    <div>
                        <h3>Escolha a linha</h3>
                        <p>O valor muda conforme a linha escolhida</p>
                    </div>
                </div>

                <div class="doces-lines">
                    ${Object.entries(linhas).map(([id, item]) => `
                        <button type="button" class="doces-line ${id === docesLinhaSelecionada ? "active" : ""}" data-line="${id}">
                            <div class="doces-line-info">
                                <strong>${item.nome}</strong>
                                <span>${id === "comum" ? "Tradicionais" : id === "gourmet" ? "Sabores especiais" : "Linha premium"}</span>
                            </div>
                            <div class="doces-line-price">
                                <small>cento</small>
                                <strong>${formatarPrecoDoces(item.precoCento)}</strong>
                            </div>
                        </button>
                    `).join("")}
                </div>
            </div>

            <div class="doces-section">
                <div class="doces-section-title">
                    <div>
                        <h3>Escolha os sabores</h3>
                        <p>Escolha ${maxSabores === 1 ? "1 sabor" : `até ${maxSabores} sabores`}</p>
                    </div>
                    <span class="doces-flavor-counter">${docesSaboresSelecionados.length} / ${maxSabores}</span>
                </div>

                <div class="doces-flavors">
                    ${(linha?.sabores || []).map(sabor => {
                        const ativo = docesSaboresSelecionados.includes(sabor);
                        return `
                            <button type="button" class="doces-flavor ${ativo ? "active" : ""}" data-flavor="${sabor}">
                                <span class="doces-flavor-check">${ativo ? "✓" : ""}</span>
                                <span class="doces-flavor-name">${sabor}</span>
                            </button>
                        `;
                    }).join("")}
                </div>
            </div>

            <div class="doces-info">
                <span>🍬</span>
                <p>Docinhos em forminha de papel, com aproximadamente 18g cada. A Surpresa de Uva possui aproximadamente 25g.</p>
            </div>

            <div class="doces-summary">
                <div class="doces-summary-info">
                    <span>${docesQuantidade} doces</span>
                    <small>${linha?.nome || ""}</small>
                </div>
                <div class="doces-summary-price">
                    <span>Total dos docinhos</span>
                    <strong>${formatarPrecoDoces(calcularPrecoDoces())}</strong>
                </div>
            </div>
        </div>
    `;

    docesContainer.querySelector("#docesDecrease")?.addEventListener("click", () => {
        const minimo = docesProdutoAtual.quantidadeMinima || 25;
        const intervalo = docesProdutoAtual.intervaloQuantidade || 25;
        if (docesQuantidade > minimo) {
            docesQuantidade -= intervalo;
            const max = obterMaxSaboresDoces();
            if (docesSaboresSelecionados.length > max) {
                docesSaboresSelecionados = docesSaboresSelecionados.slice(0, max);
            }
            renderizarModalDoces();
            notificarAlteracaoDoces();
        }
    });

    docesContainer.querySelector("#docesIncrease")?.addEventListener("click", () => {
        docesQuantidade += docesProdutoAtual.intervaloQuantidade || 25;
        renderizarModalDoces();
        notificarAlteracaoDoces();
    });

    docesContainer.querySelectorAll(".doces-line").forEach(botao => {
        botao.addEventListener("click", () => {
            docesLinhaSelecionada = botao.dataset.line;
            docesSaboresSelecionados = [];
            renderizarModalDoces();
            notificarAlteracaoDoces();
        });
    });

    docesContainer.querySelectorAll(".doces-flavor").forEach(botao => {
        botao.addEventListener("click", () => {
            const sabor = botao.dataset.flavor;
            const indice = docesSaboresSelecionados.indexOf(sabor);

            if (indice >= 0) {
                docesSaboresSelecionados.splice(indice, 1);
            } else {
                const max = obterMaxSaboresDoces();
                if (docesSaboresSelecionados.length >= max) {
                    alert(`Para essa quantidade, você pode escolher até ${max} ${max === 1 ? "sabor" : "sabores"}.`);
                    return;
                }
                docesSaboresSelecionados.push(sabor);
            }

            renderizarModalDoces();
            notificarAlteracaoDoces();
        });
    });
}

function iniciarModalDoces(container, produto, aoAlterar) {
    docesContainer = container;
    docesProdutoAtual = produto;
    docesAoAlterar = aoAlterar;
    docesQuantidade = produto.quantidadeMinima || 25;
    docesLinhaSelecionada = "comum";
    docesSaboresSelecionados = [];
    renderizarModalDoces();
    notificarAlteracaoDoces();
}
