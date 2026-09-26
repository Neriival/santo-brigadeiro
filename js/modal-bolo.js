/* =========================================================
   BOLOS - SANTO BRIGADEIRO
   Tamanho, massa e recheios ficam isolados neste arquivo.
========================================================= */

let boloProdutoAtual = null;
let boloContainer = null;
let boloTamanhoSelecionado = null;
let boloMassaSelecionada = null;
let boloRecheiosSelecionados = [];
let boloAoAlterar = null;

function formatarPrecoBolo(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function possuiRecheioPremiumBolo() {
    return boloRecheiosSelecionados.some(recheio => recheio.tipo === "premium");
}

function obterPrecoBolo() {
    if (!boloProdutoAtual) return 0;
    if (!boloTamanhoSelecionado) return Number(boloProdutoAtual.preco || 0);

    return Number(
        possuiRecheioPremiumBolo()
            ? boloTamanhoSelecionado.precoPremium
            : boloTamanhoSelecionado.precoComum
    );
}

function obterDadosBolo() {
    return {
        tamanho: boloTamanhoSelecionado?.nome || null,
        massa: boloMassaSelecionada,
        recheios: boloRecheiosSelecionados.map(recheio => ({ ...recheio })),
        preco: obterPrecoBolo()
    };
}

function validarBolo() {
    if (!boloTamanhoSelecionado) {
        alert("Escolha o tamanho do bolo.");
        return false;
    }
    if (!boloMassaSelecionada) {
        alert("Escolha a massa do bolo.");
        return false;
    }
    if (boloRecheiosSelecionados.length === 0) {
        alert("Escolha pelo menos 1 recheio.");
        return false;
    }
    return true;
}

function notificarAlteracaoBolo() {
    if (typeof boloAoAlterar === "function") boloAoAlterar(obterDadosBolo());
}

function criarTamanhosBolo() {
    const section = document.createElement("div");
    section.className = "option-section";
    section.innerHTML = `
        <div class="option-title"><h3>Escolha o tamanho</h3><span>Obrigatório</span></div>
        <div class="size-options"></div>
    `;
    boloContainer.appendChild(section);

    const container = section.querySelector(".size-options");

    boloProdutoAtual.tamanhos.forEach((tamanho, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-card";
        button.innerHTML = `
            <div><strong>${tamanho.nome}</strong><small>${tamanho.serve}</small></div>
            <span>${formatarPrecoBolo(tamanho.precoComum)}</span>
        `;

        button.addEventListener("click", () => {
            boloTamanhoSelecionado = tamanho;
            boloContainer.querySelectorAll(".option-card").forEach(item => item.classList.remove("selected"));
            button.classList.add("selected");
            notificarAlteracaoBolo();
        });

        container.appendChild(button);

        if (index === 0) {
            boloTamanhoSelecionado = tamanho;
            button.classList.add("selected");
        }
    });
}

function criarMassasBolo() {
    const section = document.createElement("div");
    section.className = "option-section";
    section.innerHTML = `
        <div class="option-title"><h3>Escolha a massa</h3><span>Obrigatório</span></div>
        <div class="simple-options"></div>
    `;
    boloContainer.appendChild(section);

    const container = section.querySelector(".simple-options");

    boloProdutoAtual.massas.forEach(massa => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "simple-option";
        button.textContent = massa;

        button.addEventListener("click", () => {
            container.querySelectorAll(".simple-option").forEach(item => item.classList.remove("selected"));
            button.classList.add("selected");
            boloMassaSelecionada = massa;
            notificarAlteracaoBolo();
        });

        container.appendChild(button);
    });
}

function criarRecheiosBolo(titulo, recheios, premium = false) {
    const section = document.createElement("div");
    section.className = "option-section";
    section.innerHTML = `
        <div class="option-title">
            <div><h3>${titulo}</h3><small>Escolha até 2 recheios</small></div>
            ${premium ? "<span>Premium</span>" : ""}
        </div>
        <div class="filling-options"></div>
    `;
    boloContainer.appendChild(section);

    const container = section.querySelector(".filling-options");

    recheios.forEach(recheio => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filling-option";
        button.innerHTML = `
            <div class="filling-info">
                <span>${recheio.nome}</span>
                ${recheio.tipo === "premium" ? "<strong>Valor premium</strong>" : ""}
            </div>
            <div class="check">✓</div>
        `;

        button.addEventListener("click", () => {
            const indice = boloRecheiosSelecionados.findIndex(item => item.nome === recheio.nome);

            if (indice >= 0) {
                boloRecheiosSelecionados.splice(indice, 1);
                button.classList.remove("selected");
            } else {
                if (boloRecheiosSelecionados.length >= 2) {
                    alert("Você pode escolher no máximo 2 recheios.");
                    return;
                }
                boloRecheiosSelecionados.push(recheio);
                button.classList.add("selected");
            }

            notificarAlteracaoBolo();
        });

        container.appendChild(button);
    });
}

function iniciarModalBolo(container, produto, aoAlterar) {
    boloContainer = container;
    boloProdutoAtual = produto;
    boloAoAlterar = aoAlterar;
    boloTamanhoSelecionado = null;
    boloMassaSelecionada = null;
    boloRecheiosSelecionados = [];

    boloContainer.innerHTML = "";

    if (produto.tamanhos?.length) criarTamanhosBolo();
    if (produto.massas?.length) criarMassasBolo();

    if (produto.recheiosComuns?.length) {
        criarRecheiosBolo(
            "Recheios comuns",
            produto.recheiosComuns.map(nome => ({ nome, tipo: "comum" }))
        );
    }

    if (produto.recheiosPremium?.length) {
        criarRecheiosBolo(
            "Recheios premium",
            produto.recheiosPremium.map(nome => ({ nome, tipo: "premium" })),
            true
        );
    }

    notificarAlteracaoBolo();
}
