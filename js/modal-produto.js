/* =========================================================
   MODAL DE PRODUTO - SANTO BRIGADEIRO
========================================================= */


/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const productModalOverlay =
    document.getElementById("productModalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalProductImage =
    document.getElementById("modalProductImage");

const modalCategory =
    document.getElementById("modalCategory");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductDescription =
    document.getElementById("modalProductDescription");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const productOptions =
    document.getElementById("productOptions");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const productQuantity =
    document.getElementById("productQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");

const productObservation =
    document.getElementById("productObservation");

const productObservationLabel =
    document.getElementById("productObservationLabel");    

const modalTotal =
    document.getElementById("modalTotal");

const modalAddCart =
    document.getElementById("modalAddCart");


/* =========================================================
   ESTADO DO MODAL
========================================================= */

let produtoAtual = null;

let quantidadeAtual = 1;

let tamanhoSelecionado = null;

let massaSelecionada = null;

let recheiosSelecionados = [];


/* =========================================================
   ABRIR PRODUTO
========================================================= */

function abrirProduto(id) {

    const produto = produtos.find(
        item => item.id === id
    );


    if (!produto) {

        console.error(
            "Produto não encontrado:",
            id
        );

        return;

    }


    /* Produto atual */

    produtoAtual = produto;


    /* Reset das escolhas */

    quantidadeAtual = 1;

    tamanhoSelecionado = null;

    massaSelecionada = null;

    recheiosSelecionados = [];


    /* Reset da quantidade */

    if (productQuantity) {

        productQuantity.textContent =
            quantidadeAtual;

    }


    /* Reset observação */

    if (productObservation) {

        productObservation.value = "";

    }

    /* =====================================================
    CONFIGURAR OBSERVAÇÃO
    ===================================================== */

    if (productObservation) {

        productObservation.value = "";

        if (produto.categoria === "topos") {

            productObservation.placeholder =
                "Ex: Nome Joaquim, 1 ano, tema Homem-Aranha, cores azul e vermelho...";

            productObservation.required = true;

            if (productObservationLabel) {
                productObservationLabel.innerHTML =
                    "Descreva como deseja seu topo <strong>*</strong>";
            }

        } else {

            productObservation.placeholder =
                "Ex: escrever nome no bolo, retirar algum ingrediente...";

            productObservation.required = false;

            if (productObservationLabel) {
                productObservationLabel.textContent =
                    "Alguma observação?";
            }
        }
    }


    /* =====================================================
       IMAGEM
    ===================================================== */

    if (produto.imagem) {

        modalProductImage.innerHTML = `

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >

        `;

    } else {

        modalProductImage.innerHTML = `

            <div class="modal-no-image">
                🎂
            </div>

        `;

    }


    /* Cria opções */

    criarOpcoesProduto();


    /* Atualiza preço */

    atualizarPrecoProduto();

    atualizarTotal();


    /* Abre modal */

    productModalOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR PRODUTO
========================================================= */

function fecharProduto() {

    productModalOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow = "";

}


/* =========================================================
   BOTÃO FECHAR
========================================================= */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharProduto
    );

}


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

if (productModalOverlay) {

    productModalOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModalOverlay
            ) {

                fecharProduto();

            }

        }
    );

}


/* =========================================================
   CRIAR OPÇÕES DO PRODUTO
========================================================= */

function criarOpcoesProduto() {

    productOptions.innerHTML = "";


    if (!produtoAtual) {
        return;
    }


    /* =====================================================
       TAMANHOS
    ===================================================== */

    if (
        produtoAtual.tamanhos &&
        produtoAtual.tamanhos.length > 0
    ) {

        const section =
            document.createElement("div");


        section.classList.add(
            "option-section"
        );


        section.innerHTML = `

            <div class="option-title">

                <h3>
                    Escolha o tamanho
                </h3>

                <span>
                    Obrigatório
                </span>

            </div>


            <div
                class="size-options"
            ></div>

        `;


        productOptions.appendChild(
            section
        );


        const sizeOptions =
            section.querySelector(
                ".size-options"
            );


        produtoAtual.tamanhos.forEach(
            (tamanho, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.classList.add(
                    "option-card"
                );


                button.innerHTML = `

                    <div>

                        <strong>
                            ${tamanho.nome}
                        </strong>

                        <small>
                            ${tamanho.serve}
                        </small>

                    </div>


                    <span>
                        ${formatarPreco(
                            tamanho.precoComum
                        )}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        selecionarTamanho(
                            tamanho,
                            button
                        );

                    }
                );


                sizeOptions.appendChild(
                    button
                );


                /*
                    Primeiro tamanho fica
                    selecionado automaticamente
                */

                if (index === 0) {

                    selecionarTamanho(
                        tamanho,
                        button
                    );

                }

            }
        );

    }


    /* =====================================================
       MASSAS
    ===================================================== */

    if (
        produtoAtual.massas &&
        produtoAtual.massas.length > 0
    ) {

        const section =
            document.createElement("div");


        section.classList.add(
            "option-section"
        );


        section.innerHTML = `

            <div class="option-title">

                <h3>
                    Escolha a massa
                </h3>

                <span>
                    Obrigatório
                </span>

            </div>


            <div
                class="simple-options"
            ></div>

        `;


        productOptions.appendChild(
            section
        );


        const container =
            section.querySelector(
                ".simple-options"
            );


        produtoAtual.massas.forEach(
            massa => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.classList.add(
                    "simple-option"
                );


                button.textContent =
                    massa;


                button.addEventListener(
                    "click",
                    () => {

                        /*
                            Remove seleção somente
                            das massas desta seção
                        */

                        container
                            .querySelectorAll(
                                ".simple-option"
                            )
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );


                        massaSelecionada =
                            massa;

                    }
                );


                container.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       RECHEIOS COMUNS
    ===================================================== */

    if (
        produtoAtual.recheiosComuns &&
        produtoAtual.recheiosComuns.length > 0
    ) {

        const recheiosComuns =
            produtoAtual.recheiosComuns.map(
                nome => ({

                    nome: nome,

                    tipo: "comum"

                })
            );


        criarSecaoRecheios(
            "Recheios comuns",
            recheiosComuns,
            false
        );

    }


    /* =====================================================
       RECHEIOS PREMIUM
    ===================================================== */

    if (
        produtoAtual.recheiosPremium &&
        produtoAtual.recheiosPremium.length > 0
    ) {

        const recheiosPremium =
            produtoAtual.recheiosPremium.map(
                nome => ({

                    nome: nome,

                    tipo: "premium"

                })
            );


        criarSecaoRecheios(
            "Recheios premium",
            recheiosPremium,
            true
        );

    }

}


/* =========================================================
   CRIAR SEÇÃO DE RECHEIOS
========================================================= */

function criarSecaoRecheios(
    titulo,
    recheios,
    premium = false
) {

    const section =
        document.createElement("div");


    section.classList.add(
        "option-section"
    );


    section.innerHTML = `

        <div class="option-title">

            <div>

                <h3>
                    ${titulo}
                </h3>

                <small>
                    Escolha até 2 recheios
                </small>

            </div>


            ${
                premium
                    ? `
                        <span>
                            Premium
                        </span>
                    `
                    : ""
            }

        </div>


        <div
            class="filling-options"
        ></div>

    `;


    productOptions.appendChild(
        section
    );


    const container =
        section.querySelector(
            ".filling-options"
        );


    recheios.forEach(
        recheio => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.classList.add(
                "filling-option"
            );


            button.innerHTML = `

                <div class="filling-info">

                    <span>
                        ${recheio.nome}
                    </span>


                    ${
                        recheio.tipo ===
                        "premium"

                            ? `
                                <strong>
                                    Valor premium
                                </strong>
                            `

                            : ""
                    }

                </div>


                <div class="check">
                    ✓
                </div>

            `;


            button.addEventListener(
                "click",
                () => {

                    selecionarRecheio(
                        recheio,
                        button
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   SELECIONAR TAMANHO
========================================================= */

function selecionarTamanho(
    tamanho,
    button
) {

    tamanhoSelecionado =
        tamanho;


    /*
        Remove seleção dos outros tamanhos
    */

    productOptions
        .querySelectorAll(
            ".option-card"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );

            }
        );


    /*
        Seleciona o tamanho atual
    */

    button.classList.add(
        "selected"
    );


    atualizarPrecoProduto();

    atualizarTotal();

}


/* =========================================================
   SELECIONAR RECHEIO
========================================================= */

function selecionarRecheio(
    recheio,
    button
) {

    /*
        Procura se esse recheio
        já está selecionado
    */

    const index =
        recheiosSelecionados.findIndex(
            item =>
                item.nome ===
                recheio.nome
        );


    /* =====================================================
       SE JÁ ESTIVER SELECIONADO:
       REMOVE
    ===================================================== */

    if (index !== -1) {

        recheiosSelecionados.splice(
            index,
            1
        );


        button.classList.remove(
            "selected"
        );


        atualizarPrecoProduto();

        atualizarTotal();


        return;

    }


    /* =====================================================
       LIMITE DE 2 RECHEIOS
    ===================================================== */

    if (
        recheiosSelecionados.length >= 2
    ) {

        alert(
            "Você pode escolher no máximo 2 recheios."
        );


        return;

    }


    /* =====================================================
       ADICIONA RECHEIO
    ===================================================== */

    recheiosSelecionados.push(
        recheio
    );


    button.classList.add(
        "selected"
    );


    atualizarPrecoProduto();

    atualizarTotal();

}


/* =========================================================
   VERIFICAR SE EXISTE RECHEIO PREMIUM
========================================================= */

function possuiRecheioPremium() {

    return recheiosSelecionados.some(
        recheio =>
            recheio.tipo === "premium"
    );

}


/* =========================================================
   OBTER PREÇO ATUAL
========================================================= */

function obterPrecoAtual() {

    if (!produtoAtual) {

        return 0;

    }


    /*
        Produto que NÃO possui tamanhos
    */

    if (!tamanhoSelecionado) {

        return Number(
            produtoAtual.preco || 0
        );

    }


    /*
        Se existir pelo menos
        um recheio premium
    */

    if (possuiRecheioPremium()) {

        return Number(
            tamanhoSelecionado.precoPremium
        );

    }


    /*
        Caso contrário:
        preço comum
    */

    return Number(
        tamanhoSelecionado.precoComum
    );

}


/* =========================================================
   ATUALIZAR PREÇO DO PRODUTO
========================================================= */

function atualizarPrecoProduto() {

    if (!modalProductPrice) {
        return;
    }


    const preco =
        obterPrecoAtual();


    modalProductPrice.textContent =
        formatarPreco(preco);

}


/* =========================================================
   ATUALIZAR TOTAL
========================================================= */

function atualizarTotal() {

    if (!produtoAtual) {
        return;
    }


    const precoUnitario =
        obterPrecoAtual();


    const total =
        precoUnitario *
        quantidadeAtual;


    modalTotal.textContent =
        formatarPreco(total);

}


/* =========================================================
   AUMENTAR QUANTIDADE
========================================================= */

if (increaseQuantity) {

    increaseQuantity.addEventListener(
        "click",
        () => {

            quantidadeAtual++;


            productQuantity.textContent =
                quantidadeAtual;


            atualizarTotal();

        }
    );

}


/* =========================================================
   DIMINUIR QUANTIDADE
========================================================= */

if (decreaseQuantity) {

    decreaseQuantity.addEventListener(
        "click",
        () => {

            if (
                quantidadeAtual <= 1
            ) {

                return;

            }


            quantidadeAtual--;


            productQuantity.textContent =
                quantidadeAtual;


            atualizarTotal();

        }
    );

}

/* =========================================================
   CARRINHO
========================================================= */

let carrinho = [];


/* =========================================================
   ADICIONAR AO CARRINHO
========================================================= */

if (modalAddCart) {

    modalAddCart.addEventListener(
        "click",
        () => {

            if (!produtoAtual) {
                return;
            }


            /* =============================================
               VALIDAR TAMANHO
            ============================================= */

            if (
                produtoAtual.tamanhos &&
                !tamanhoSelecionado
            ) {

                alert(
                    "Escolha o tamanho do produto."
                );

                return;
            }


            /* =============================================
               VALIDAR MASSA
            ============================================= */

            if (
                produtoAtual.massas &&
                !massaSelecionada
            ) {

                alert(
                    "Escolha a massa do bolo."
                );

                return;
            }


            /* =============================================
               VALIDAR RECHEIO
            ============================================= */

            if (
                (
                    produtoAtual.recheiosComuns ||
                    produtoAtual.recheiosPremium
                ) &&
                recheiosSelecionados.length === 0
            ) {

                alert(
                    "Escolha pelo menos 1 recheio."
                );

                return;
            }


            /* =============================================
               VALIDAR DESCRIÇÃO DO TOPO
            ============================================= */

            const observacao =
                productObservation
                    ? productObservation.value.trim()
                    : "";


            if (
                produtoAtual.categoria === "topos" &&
                observacao === ""
            ) {

                alert(
                    "Descreva como deseja o seu topo personalizado."
                );

                productObservation.focus();

                return;
            }


            /* =============================================
               CRIAR ITEM
            ============================================= */

            const itemCarrinho = {

                id: Date.now(),

                produtoId:
                    produtoAtual.id,

                nome:
                    produtoAtual.nome,

                categoria:
                    produtoAtual.categoria,

                quantidade:
                    quantidadeAtual,

                precoUnitario:
                    obterPrecoAtual(),

                total:
                    obterPrecoAtual() *
                    quantidadeAtual,

                tamanho:
                    tamanhoSelecionado
                        ? tamanhoSelecionado.nome
                        : null,

                massa:
                    massaSelecionada,

                recheios:
                    recheiosSelecionados.map(
                        recheio => ({
                            nome: recheio.nome,
                            tipo: recheio.tipo
                        })
                    ),

                observacao:
                    observacao
            };


            /* =============================================
               ADICIONAR
            ============================================= */

            carrinho.push(
                itemCarrinho
            );


            /* =============================================
               ATUALIZAR CONTADOR
            ============================================= */

            atualizarContadorCarrinho();


            console.log(
                "Carrinho:",
                carrinho
            );


            alert(
                "Produto adicionado ao carrinho!"
            );


            fecharProduto();
        }
    );
}


/* =========================================================
   ATUALIZAR CONTADOR DO CARRINHO
========================================================= */

function atualizarContadorCarrinho() {

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (!cartCount) {
        return;
    }


    const quantidadeTotal =
        carrinho.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );


    cartCount.textContent =
        quantidadeTotal;
}


/* =========================================================
   FECHAR COM ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            productModalOverlay.classList.contains(
                "active"
            )
        ) {

            fecharProduto();

        }

    }
);