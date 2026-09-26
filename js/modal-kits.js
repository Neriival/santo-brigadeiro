/* =========================================================
   KIT FESTA - SANTO BRIGADEIRO
========================================================= */

let kitProdutoAtual = null;
let kitSelecionado = null;
let kitMassaSelecionada = null;
let kitRecheiosSelecionados = [];
let kitDocesSelecionados = [];
let kitSalgadosSelecionados = [];
let kitContainer = null;
let kitAoAlterar = null;

function formatarPrecoKit(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function obterMaxSaboresKit(quantidade) {
    if (quantidade >= 200) return 6;
    if (quantidade >= 100) return 4;
    if (quantidade >= 50) return 2;
    return 1;
}

function limitarSelecoesKit() {
    if (!kitSelecionado) return;
    kitDocesSelecionados = kitDocesSelecionados.slice(0, obterMaxSaboresKit(kitSelecionado.doces));
    kitSalgadosSelecionados = kitSalgadosSelecionados.slice(0, obterMaxSaboresKit(kitSelecionado.salgados));
}

function obterDadosKit() {
    return {
        kitId: kitSelecionado?.id || "",
        kitNome: kitSelecionado?.nome || "",
        serve: kitSelecionado?.serve || "",
        preco: Number(kitSelecionado?.preco || 0),
        boloKg: kitSelecionado?.boloKg || 0,
        doces: kitSelecionado?.doces || 0,
        salgados: kitSelecionado?.salgados || 0,
        massa: kitMassaSelecionada,
        recheios: [...kitRecheiosSelecionados],
        saboresDoces: [...kitDocesSelecionados],
        saboresSalgados: [...kitSalgadosSelecionados]
    };
}

function validarKitFesta() {
    if (!kitSelecionado) {
        alert("Escolha um Kit Festa.");
        return false;
    }
    if (!kitMassaSelecionada) {
        alert("Escolha a massa do bolo.");
        return false;
    }
    if (kitRecheiosSelecionados.length === 0) {
        alert("Escolha pelo menos 1 recheio para o bolo.");
        return false;
    }
    if (kitDocesSelecionados.length === 0) {
        alert("Escolha pelo menos 1 sabor de doce.");
        return false;
    }
    if (kitSalgadosSelecionados.length === 0) {
        alert("Escolha pelo menos 1 sabor de salgado.");
        return false;
    }
    return true;
}

function notificarAlteracaoKit() {
    if (typeof kitAoAlterar === "function") kitAoAlterar(obterDadosKit());
}

function botaoSelecaoKit(classe, valor, selecionados, limite, atributo) {
    const ativo = selecionados.includes(valor);
    return `<button type="button" class="${classe} ${ativo ? "selected" : ""}" ${atributo}="${valor}">
        <span>${valor}</span><span class="kit-check">${ativo ? "✓" : ""}</span>
    </button>`;
}

function renderizarModalKit() {
    if (!kitContainer || !kitProdutoAtual) return;

    if (!kitSelecionado) kitSelecionado = kitProdutoAtual.kitsFesta?.[0] || null;
    limitarSelecoesKit();

    const maxDoces = obterMaxSaboresKit(kitSelecionado.doces);
    const maxSalgados = obterMaxSaboresKit(kitSelecionado.salgados);

    kitContainer.innerHTML = `
        <div class="kit-options">
            <div class="kit-section">
                <div class="kit-title"><div><h3>Escolha o Kit Festa</h3><p>Topo de bolo cobrado à parte</p></div></div>
                <div class="kit-cards">
                    ${(kitProdutoAtual.kitsFesta || []).map(kit => `
                        <button type="button" class="kit-card ${kit.id === kitSelecionado.id ? "selected" : ""}" data-kit="${kit.id}">
                            <div><strong>${kit.nome}</strong><small>Serve ${kit.serve} pessoas</small></div>
                            <span>${formatarPrecoKit(kit.preco)}</span>
                            <p>Bolo ${String(kit.boloKg).replace(".", ",")}kg • ${kit.doces} doces • ${kit.salgados} salgados</p>
                        </button>`).join("")}
                </div>
            </div>

            <div class="kit-section">
                <div class="kit-title"><div><h3>Massa do bolo</h3><p>Escolha 1 opção</p></div></div>
                <div class="kit-simple-options">
                    ${(kitProdutoAtual.massas || []).map(massa => `
                        <button type="button" class="kit-simple ${massa === kitMassaSelecionada ? "selected" : ""}" data-massa="${massa}">${massa}</button>`).join("")}
                </div>
            </div>

            <div class="kit-section">
                <div class="kit-title"><div><h3>Recheios do bolo</h3><p>Escolha 1 ou 2 sabores</p></div><span>${kitRecheiosSelecionados.length} / 2</span></div>
                <div class="kit-flavors">
                    ${(kitProdutoAtual.recheiosBolo || []).map(sabor => botaoSelecaoKit("kit-flavor", sabor, kitRecheiosSelecionados, 2, "data-recheio")).join("")}
                </div>
            </div>

            <div class="kit-section">
                <div class="kit-title"><div><h3>Sabores dos doces</h3><p>Doces da linha comum • escolha até ${maxDoces}</p></div><span>${kitDocesSelecionados.length} / ${maxDoces}</span></div>
                <div class="kit-flavors">
                    ${(kitProdutoAtual.saboresDoces || []).map(sabor => botaoSelecaoKit("kit-flavor", sabor, kitDocesSelecionados, maxDoces, "data-doce")).join("")}
                </div>
            </div>

            <div class="kit-section">
                <div class="kit-title"><div><h3>Sabores dos salgados fritos</h3><p>Escolha até ${maxSalgados}</p></div><span>${kitSalgadosSelecionados.length} / ${maxSalgados}</span></div>
                <div class="kit-flavors">
                    ${(kitProdutoAtual.saboresSalgados || []).map(sabor => botaoSelecaoKit("kit-flavor", sabor, kitSalgadosSelecionados, maxSalgados, "data-salgado")).join("")}
                </div>
            </div>

            <div class="kit-info"><span>🎉</span><p><strong>${kitSelecionado.nome}</strong> serve aproximadamente ${kitSelecionado.serve} pessoas. O topo de bolo não está incluso e é cobrado à parte.</p></div>
            <div class="kit-summary"><div><span>${kitSelecionado.nome}</span><small>Bolo ${String(kitSelecionado.boloKg).replace(".", ",")}kg + ${kitSelecionado.doces} doces + ${kitSelecionado.salgados} salgados fritos</small></div><strong>${formatarPrecoKit(kitSelecionado.preco)}</strong></div>
        </div>`;

    kitContainer.querySelectorAll("[data-kit]").forEach(botao => botao.addEventListener("click", () => {
        kitSelecionado = kitProdutoAtual.kitsFesta.find(kit => kit.id === botao.dataset.kit) || kitSelecionado;
        limitarSelecoesKit();
        renderizarModalKit(); notificarAlteracaoKit();
    }));

    kitContainer.querySelectorAll("[data-massa]").forEach(botao => botao.addEventListener("click", () => {
        kitMassaSelecionada = botao.dataset.massa;
        renderizarModalKit(); notificarAlteracaoKit();
    }));

    kitContainer.querySelectorAll("[data-recheio]").forEach(botao => botao.addEventListener("click", () => {
        const sabor = botao.dataset.recheio;
        const i = kitRecheiosSelecionados.indexOf(sabor);
        if (i >= 0) kitRecheiosSelecionados.splice(i, 1);
        else if (kitRecheiosSelecionados.length < 2) kitRecheiosSelecionados.push(sabor);
        else { alert("Você pode escolher no máximo 2 recheios para o bolo."); return; }
        renderizarModalKit(); notificarAlteracaoKit();
    }));

    kitContainer.querySelectorAll("[data-doce]").forEach(botao => botao.addEventListener("click", () => {
        const sabor = botao.dataset.doce;
        const i = kitDocesSelecionados.indexOf(sabor);
        if (i >= 0) kitDocesSelecionados.splice(i, 1);
        else if (kitDocesSelecionados.length < maxDoces) kitDocesSelecionados.push(sabor);
        else { alert(`Neste kit você pode escolher até ${maxDoces} sabores de doces.`); return; }
        renderizarModalKit(); notificarAlteracaoKit();
    }));

    kitContainer.querySelectorAll("[data-salgado]").forEach(botao => botao.addEventListener("click", () => {
        const sabor = botao.dataset.salgado;
        const i = kitSalgadosSelecionados.indexOf(sabor);
        if (i >= 0) kitSalgadosSelecionados.splice(i, 1);
        else if (kitSalgadosSelecionados.length < maxSalgados) kitSalgadosSelecionados.push(sabor);
        else { alert(`Neste kit você pode escolher até ${maxSalgados} sabores de salgados.`); return; }
        renderizarModalKit(); notificarAlteracaoKit();
    }));
}

function iniciarModalKit(container, produto, aoAlterar) {
    kitContainer = container;
    kitProdutoAtual = produto;
    kitAoAlterar = aoAlterar;
    kitSelecionado = produto.kitsFesta?.[0] || null;
    kitMassaSelecionada = null;
    kitRecheiosSelecionados = [];
    kitDocesSelecionados = [];
    kitSalgadosSelecionados = [];
    renderizarModalKit();
    notificarAlteracaoKit();
}
