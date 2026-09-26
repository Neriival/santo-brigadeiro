/* =========================================================
   SALGADOS - SANTO BRIGADEIRO
========================================================= */

let salgadosProdutoAtual = null;
let salgadosQuantidade = 25;
let salgadosLinhaSelecionada = "mini";
let salgadosSaboresSelecionados = [];
let salgadosPreparo = "fritos";
let salgadosContainer = null;
let salgadosAoAlterar = null;

function formatarPrecoSalgados(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function obterMaxSaboresSalgados() {
    if (!salgadosProdutoAtual) return 1;
    const regra = (salgadosProdutoAtual.regrasSabores || []).find(item =>
        salgadosQuantidade >= item.quantidadeMinima &&
        (item.quantidadeMaxima === null || salgadosQuantidade <= item.quantidadeMaxima)
    );
    return regra ? regra.maxSabores : 1;
}

function obterLinhaSalgadosAtual() {
    return salgadosProdutoAtual?.linhasSalgados?.[salgadosLinhaSelecionada] || null;
}

function calcularPrecoSalgados() {
    const linha = obterLinhaSalgadosAtual();
    return linha ? Number(linha.precoCento || 0) * (salgadosQuantidade / 100) : 0;
}

function obterDadosSalgados() {
    const linha = obterLinhaSalgadosAtual();
    return {
        quantidadeSalgados: salgadosQuantidade,
        linhaId: salgadosLinhaSelecionada,
        linha: linha?.nome || "",
        sabores: [...salgadosSaboresSelecionados],
        preparo: salgadosLinhaSelecionada === "assados" ? "Assados" : (salgadosPreparo === "congelados" ? "Congelados" : "Fritos"),
        maxSabores: obterMaxSaboresSalgados(),
        preco: calcularPrecoSalgados()
    };
}

function validarSalgados() {
    if (!salgadosProdutoAtual) return false;
    if (salgadosSaboresSelecionados.length === 0) {
        alert("Escolha pelo menos 1 sabor de salgado.");
        return false;
    }
    return true;
}

function notificarAlteracaoSalgados() {
    if (typeof salgadosAoAlterar === "function") salgadosAoAlterar(obterDadosSalgados());
}

function renderizarModalSalgados() {
    if (!salgadosContainer || !salgadosProdutoAtual) return;

    const linha = obterLinhaSalgadosAtual();
    const maxSabores = obterMaxSaboresSalgados();
    const linhas = salgadosProdutoAtual.linhasSalgados || {};
    const mostraPreparo = salgadosLinhaSelecionada !== "assados";

    salgadosContainer.innerHTML = `
        <div class="salgados-options">
            <div class="salgados-section">
                <div class="salgados-section-title"><div><h3>Quantidade de salgados</h3><p>Escolha de 25 em 25 unidades</p></div></div>
                <div class="salgados-quantity">
                    <button type="button" class="salgados-quantity-button" id="salgadosDecrease">−</button>
                    <div class="salgados-quantity-value"><strong>${salgadosQuantidade}</strong><span>salgados</span></div>
                    <button type="button" class="salgados-quantity-button" id="salgadosIncrease">+</button>
                </div>
                <div class="salgados-flavor-limit">Você pode escolher até <strong>${maxSabores} ${maxSabores === 1 ? "sabor" : "sabores"}</strong></div>
            </div>

            <div class="salgados-section">
                <div class="salgados-section-title"><div><h3>Escolha a linha</h3><p>O valor muda conforme a linha escolhida</p></div></div>
                <div class="salgados-lines">
                    ${Object.entries(linhas).map(([id,item]) => `
                        <button type="button" class="salgados-line ${id === salgadosLinhaSelecionada ? "active" : ""}" data-line="${id}">
                            <div class="salgados-line-info"><strong>${item.nome}</strong><span>${id === "mini" ? "Mini salgados" : id === "festa" ? "Tradicionais de festa" : "Salgados assados"}</span></div>
                            <div class="salgados-line-price"><small>cento</small><strong>${formatarPrecoSalgados(item.precoCento)}</strong></div>
                        </button>`).join("")}
                </div>
            </div>

            ${mostraPreparo ? `
            <div class="salgados-section">
                <div class="salgados-section-title"><div><h3>Como deseja receber?</h3><p>Fritos ou congelados possuem o mesmo valor</p></div></div>
                <div class="salgados-preparo">
                    <button type="button" class="salgados-preparo-option ${salgadosPreparo === "fritos" ? "active" : ""}" data-preparo="fritos">🔥 Fritos</button>
                    <button type="button" class="salgados-preparo-option ${salgadosPreparo === "congelados" ? "active" : ""}" data-preparo="congelados">❄️ Congelados</button>
                </div>
            </div>` : ""}

            <div class="salgados-section">
                <div class="salgados-section-title"><div><h3>Escolha os sabores</h3><p>${maxSabores === 1 ? "Escolha 1 sabor" : `Escolha até ${maxSabores} sabores`}</p></div><span class="salgados-flavor-counter">${salgadosSaboresSelecionados.length} / ${maxSabores}</span></div>
                <div class="salgados-flavors">
                    ${(linha?.sabores || []).map(sabor => {
                        const ativo = salgadosSaboresSelecionados.includes(sabor);
                        return `<button type="button" class="salgados-flavor ${ativo ? "active" : ""}" data-flavor="${sabor}"><span class="salgados-flavor-check">${ativo ? "✓" : ""}</span><span class="salgados-flavor-name">${sabor}</span></button>`;
                    }).join("")}
                </div>
            </div>

            <div class="salgados-info"><span>🥟</span><p>${mostraPreparo ? "Salgados fritos ou congelados são cobrados pelo mesmo valor." : "Linha de salgados assados para sua festa."}</p></div>
            <div class="salgados-summary"><div class="salgados-summary-info"><span>${salgadosQuantidade} salgados</span><small>${linha?.nome || ""}</small></div><div class="salgados-summary-price"><span>Total dos salgados</span><strong>${formatarPrecoSalgados(calcularPrecoSalgados())}</strong></div></div>
        </div>`;

    salgadosContainer.querySelector("#salgadosDecrease")?.addEventListener("click", () => {
        const minimo = salgadosProdutoAtual.quantidadeMinima || 25;
        if (salgadosQuantidade > minimo) {
            salgadosQuantidade -= salgadosProdutoAtual.intervaloQuantidade || 25;
            salgadosSaboresSelecionados = salgadosSaboresSelecionados.slice(0, obterMaxSaboresSalgados());
            renderizarModalSalgados(); notificarAlteracaoSalgados();
        }
    });
    salgadosContainer.querySelector("#salgadosIncrease")?.addEventListener("click", () => {
        salgadosQuantidade += salgadosProdutoAtual.intervaloQuantidade || 25;
        renderizarModalSalgados(); notificarAlteracaoSalgados();
    });
    salgadosContainer.querySelectorAll(".salgados-line").forEach(botao => botao.addEventListener("click", () => {
        salgadosLinhaSelecionada = botao.dataset.line;
        salgadosSaboresSelecionados = [];
        renderizarModalSalgados(); notificarAlteracaoSalgados();
    }));
    salgadosContainer.querySelectorAll(".salgados-preparo-option").forEach(botao => botao.addEventListener("click", () => {
        salgadosPreparo = botao.dataset.preparo;
        renderizarModalSalgados(); notificarAlteracaoSalgados();
    }));
    salgadosContainer.querySelectorAll(".salgados-flavor").forEach(botao => botao.addEventListener("click", () => {
        const sabor = botao.dataset.flavor;
        const indice = salgadosSaboresSelecionados.indexOf(sabor);
        if (indice >= 0) salgadosSaboresSelecionados.splice(indice, 1);
        else {
            const max = obterMaxSaboresSalgados();
            if (salgadosSaboresSelecionados.length >= max) {
                alert(`Para essa quantidade, você pode escolher até ${max} ${max === 1 ? "sabor" : "sabores"}.`); return;
            }
            salgadosSaboresSelecionados.push(sabor);
        }
        renderizarModalSalgados(); notificarAlteracaoSalgados();
    }));
}

function iniciarModalSalgados(container, produto, aoAlterar) {
    salgadosContainer = container;
    salgadosProdutoAtual = produto;
    salgadosAoAlterar = aoAlterar;
    salgadosQuantidade = produto.quantidadeMinima || 25;
    salgadosLinhaSelecionada = "mini";
    salgadosSaboresSelecionados = [];
    salgadosPreparo = "fritos";
    renderizarModalSalgados();
    notificarAlteracaoSalgados();
}
