/* =========================================================
   CARRINHO - SANTO BRIGADEIRO
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const openCart =
    document.getElementById("openCart");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartClose =
    document.getElementById("cartClose");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartSummary =
    document.getElementById("cartSummary");

const cartTotalQuantity =
    document.getElementById("cartTotalQuantity");

const cartTotal =
    document.getElementById("cartTotal");

const cartFinish =
    document.getElementById("cartFinish");


/* =========================================================
   ABRIR CARRINHO
========================================================= */

function abrirCarrinho() {

    if (!cartOverlay) {
        return;
    }

    renderizarCarrinho();

    cartOverlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   FECHAR CARRINHO
========================================================= */

function fecharCarrinho() {

    if (!cartOverlay) {
        return;
    }

    cartOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";
}


/* =========================================================
   FORMATAR PREÇO
========================================================= */

function formatarPrecoCarrinho(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   RENDERIZAR CARRINHO
========================================================= */

function renderizarCarrinho() {

    if (
        !cartItems ||
        !cartEmpty ||
        !cartSummary
    ) {
        return;
    }


    /* CARRINHO VAZIO */

    if (
        typeof carrinho === "undefined" ||
        carrinho.length === 0
    ) {

        cartItems.innerHTML = "";

        cartEmpty.style.display =
            "flex";

        cartSummary.style.display =
            "none";

        atualizarContadorCarrinho();

        return;
    }


    /* TEM PRODUTOS */

    cartEmpty.style.display =
        "none";

    cartSummary.style.display =
        "block";

    cartItems.innerHTML = "";


    carrinho.forEach(item => {

        const elemento =
            document.createElement(
                "div"
            );

        elemento.classList.add(
            "cart-item"
        );


        /* TAMANHO */

        const tamanho =
            item.tamanho
                ? `
                    <span>
                        🎂 Tamanho:
                        <strong>
                            ${item.tamanho}
                        </strong>
                    </span>
                `
                : "";


        /* MASSA */

        const massa =
            item.massa
                ? `
                    <span>
                        Massa:
                        <strong>
                            ${item.massa}
                        </strong>
                    </span>
                `
                : "";


        /* RECHEIOS */

        let recheios = "";

        if (
            item.recheios &&
            item.recheios.length > 0
        ) {

            const nomesRecheios =
                item.recheios
                    .map(
                        recheio =>
                            recheio.nome
                    )
                    .join(", ");

            recheios = `
                <span>
                    Recheio:
                    <strong>
                        ${nomesRecheios}
                    </strong>
                </span>
            `;
        }


        /* DOCINHOS */

        const detalhesDoces =
            item.categoria === "doces"
                ? `
                    <span>🍬 Quantidade: <strong>${item.quantidadeDoces} doces</strong></span>
                    <span>Linha: <strong>${item.linhaDoces}</strong></span>
                    <span>Sabores: <strong>${(item.saboresDoces || []).join(", ")}</strong></span>
                `
                : "";

        const detalhesSalgados =
            item.categoria === "salgados"
                ? `
                    <span>🥟 Quantidade: <strong>${item.quantidadeSalgados} salgados</strong></span>
                    <span>Linha: <strong>${item.linhaSalgados}</strong></span>
                    <span>Preparo: <strong>${item.preparoSalgados}</strong></span>
                    <span>Sabores: <strong>${(item.saboresSalgados || []).join(", ")}</strong></span>
                ` : "";

        const detalhesKit =
            item.tipoConfiguracao === "kit-festa"
                ? `
                    <span>🎉 <strong>${item.kitNome}</strong> - serve ${item.kitServe} pessoas</span>
                    <span>🎂 Bolo: <strong>${String(item.kitBoloKg).replace(".", ",")}kg</strong></span>
                    <span>🍬 Doces: <strong>${item.kitDoces}</strong> - ${(item.saboresDocesKit || []).join(", ")}</span>
                    <span>🥟 Salgados fritos: <strong>${item.kitSalgados}</strong> - ${(item.saboresSalgadosKit || []).join(", ")}</span>
                ` : "";


        /* OBSERVAÇÃO */

        const observacao =
            item.observacao
                ? `
                    <div class="cart-observation">

                        <strong>
                            Observação
                        </strong>

                        <p>
                            ${item.observacao}
                        </p>

                    </div>
                `
                : "";


        /* HTML DO ITEM */

        elemento.innerHTML = `

            <div class="cart-item-top">

                <h3>
                    ${item.nome}
                </h3>

                <button
                    class="cart-remove"
                    type="button"
                    data-id="${item.id}"
                    aria-label="Remover produto"
                >
                    🗑️
                </button>

            </div>


            <div class="cart-item-details">

                ${tamanho}

                ${massa}

                ${recheios}

                ${detalhesDoces}

                ${detalhesSalgados}

                ${detalhesKit}

            </div>


            ${observacao}


            <div class="cart-item-bottom">

            <div class="cart-quantity">

                <button
                    class="cart-quantity-button cart-decrease"
                    type="button"
                    data-id="${item.id}"
                >
                    −
                </button>

                <span>
                    ${item.quantidade}
                </span>

                <button
                    class="cart-quantity-button cart-increase"
                    type="button"
                    data-id="${item.id}"
                >
                    +
                </button>

            </div>


            <div class="cart-item-price">

                <small>
                    ${formatarPrecoCarrinho(
                        item.precoUnitario
                    )} ${(["doces", "salgados"].includes(item.categoria) || item.tipoConfiguracao === "kit-festa") ? "por lote" : "cada"}
                </small>

                <strong>
                    ${formatarPrecoCarrinho(
                        item.total
                    )}
                </strong>

            </div>

        </div>

        `;


        cartItems.appendChild(
            elemento
        );

    });


    /* AUMENTAR QUANTIDADE */

    const botoesAumentar =
        document.querySelectorAll(
            ".cart-increase"
        );

    botoesAumentar.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            botao.dataset.id
                        );

                    alterarQuantidadeCarrinho(
                        id,
                        1
                    );

                }
            );

        }
    );


    /* DIMINUIR QUANTIDADE */

    const botoesDiminuir =
        document.querySelectorAll(
            ".cart-decrease"
        );

    botoesDiminuir.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            botao.dataset.id
                        );

                    alterarQuantidadeCarrinho(
                        id,
                        -1
                    );

                }
            );

        }
    );


    /* BOTÕES REMOVER */

    const botoesRemover =
        document.querySelectorAll(
            ".cart-remove"
        );


    botoesRemover.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            botao.dataset.id
                        );

                    removerItemCarrinho(
                        id
                    );

                }
            );

        }
    );


    atualizarResumoCarrinho();

}


/* =========================================================
   ALTERAR QUANTIDADE
========================================================= */

function alterarQuantidadeCarrinho(
    id,
    alteracao
) {

    const item =
        carrinho.find(
            item =>
                item.id === id
        );


    if (!item) {
        return;
    }


    item.quantidade +=
        alteracao;


    /* NÃO PERMITE MENOS DE 1 */

    if (item.quantidade < 1) {

        item.quantidade = 1;

        return;

    }


    /* RECALCULAR TOTAL */

    item.total =
        item.precoUnitario *
        item.quantidade;


    renderizarCarrinho();

    atualizarContadorCarrinho();

}

/* =========================================================
   REMOVER PRODUTO
========================================================= */

function removerItemCarrinho(id) {

    const indice =
        carrinho.findIndex(
            item =>
                item.id === id
        );


    if (indice === -1) {
        return;
    }


    carrinho.splice(
        indice,
        1
    );


    renderizarCarrinho();

    atualizarContadorCarrinho();

}


/* =========================================================
   RESUMO
========================================================= */

function atualizarResumoCarrinho() {

    if (
        typeof carrinho === "undefined"
    ) {
        return;
    }


    const quantidade =
        carrinho.reduce(
            (total, item) =>
                total +
                item.quantidade,
            0
        );


    const valor =
        carrinho.reduce(
            (total, item) =>
                total +
                item.total,
            0
        );


    if (cartTotalQuantity) {

        cartTotalQuantity.textContent =
            quantidade === 1
                ? "1 item"
                : `${quantidade} itens`;

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatarPrecoCarrinho(
                valor
            );

    }


    atualizarContadorCarrinho();

}


/* =========================================================
   EVENTOS
========================================================= */


/* ABRIR */

if (openCart) {

    openCart.addEventListener(
        "click",
        abrirCarrinho
    );

}


/* FECHAR */

if (cartClose) {

    cartClose.addEventListener(
        "click",
        fecharCarrinho
    );

}


/* CLICAR FORA */

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                cartOverlay
            ) {

                fecharCarrinho();

            }

        }
    );

}


/* ESC */

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            cartOverlay &&
            cartOverlay.classList.contains(
                "active"
            )
        ) {

            fecharCarrinho();

        }

    }
);


/* =========================================================
   CONTINUAR PEDIDO
========================================================= */

if (cartFinish) {

    cartFinish.addEventListener(
        "click",
        () => {

            if (
                typeof carrinho ===
                    "undefined" ||
                carrinho.length === 0
            ) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }


            if (
                typeof abrirCheckout ===
                "function"
            ) {

                abrirCheckout();

            }

        }
    );

}