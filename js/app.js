/* =========================================
   VARIÁVEIS DOS ELEMENTOS
========================================= */

let featuredProducts = null;
let categoryButtons = [];
let searchInput = null;


/* =========================================
   VARIÁVEIS DE CONTROLE
========================================= */

let categoriaAtual = "todos";
let buscaAtual = "";


/* =========================================
   FORMATAR PREÇO
========================================= */

function formatarPreco(preco) {

    return preco.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


/* =========================================
   CRIAR CARD DO PRODUTO
========================================= */

function criarCardProduto(produto) {

    const card =
        document.createElement("article");

    card.classList.add("product-card");


    /* ABRIR MODAL AO CLICAR NO CARD */

    card.addEventListener(
        "click",
        () => {

            abrirProduto(produto.id);

        }
    );


    card.innerHTML = `

        <div class="product-image">

            ${
                produto.imagem
                    ? `
                        <img
                            src="${produto.imagem}"
                            alt="${produto.nome}"
                        >
                    `
                    : `
                        <div class="no-image">
                            🎂
                        </div>
                    `
            }

        </div>


        <div class="product-info">

            <span class="product-category">
                ${produto.categoria}
            </span>


            <h3>
                ${produto.nome}
            </h3>


            <p>
                ${produto.descricao}
            </p>


            <div class="product-footer">

                <strong>
                    ${formatarPreco(produto.preco)}
                </strong>


                <button
                    class="add-product"
                    type="button"
                    data-id="${produto.id}"
                    aria-label="Adicionar ${produto.nome}"
                >
                    +
                </button>

            </div>

        </div>
    `;


    return card;
}


/* =========================================
   MOSTRAR PRODUTOS
========================================= */

function mostrarProdutos() {

    if (!featuredProducts) {
        return;
    }


    featuredProducts.innerHTML = "";


    const produtosFiltrados =
        produtos.filter(produto => {


            /* FILTRO DA CATEGORIA */

            const correspondeCategoria =

                categoriaAtual === "todos" ||

                produto.categoria ===
                    categoriaAtual;


            /* FILTRO DA BUSCA */

            const correspondeBusca =

                produto.nome
                    .toLowerCase()
                    .includes(buscaAtual)

                ||

                produto.descricao
                    .toLowerCase()
                    .includes(buscaAtual);


            return (
                correspondeCategoria &&
                correspondeBusca
            );

        });


    /* NENHUM PRODUTO ENCONTRADO */

    if (produtosFiltrados.length === 0) {

        featuredProducts.innerHTML = `

            <div class="empty-products">

                <span>🍰</span>

                <h3>
                    Nenhum produto encontrado
                </h3>

                <p>
                    Tente outra categoria
                    ou faça uma nova busca.
                </p>

            </div>
        `;

        return;
    }


    /* CRIA OS CARDS */

    produtosFiltrados.forEach(
        produto => {

            const card =
                criarCardProduto(produto);


            featuredProducts.appendChild(
                card
            );

        }
    );
}


/* =========================================
   CONFIGURAR CATEGORIAS
========================================= */

function configurarCategorias() {

    categoryButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {


                    /* REMOVE ACTIVE */

                    categoryButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* ADICIONA ACTIVE */

                    button.classList.add(
                        "active"
                    );


                    /* GUARDA CATEGORIA */

                    categoriaAtual =
                        button.dataset.category;


                    /* ATUALIZA PRODUTOS */

                    mostrarProdutos();

                }
            );

        }
    );
}


/* =========================================
   CONFIGURAR BUSCA
========================================= */

function configurarBusca() {

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            buscaAtual =
                searchInput.value
                    .toLowerCase()
                    .trim();


            mostrarProdutos();

        }
    );
}


/* =========================================
   INICIAR APP
========================================= */

function iniciarApp() {

    /* Agora os elementos já existem */

    featuredProducts =
        document.getElementById(
            "featuredProducts"
        );


    categoryButtons =
        document.querySelectorAll(
            ".category-card"
        );


    searchInput =
        document.getElementById(
            "searchInput"
        );


    /* CONFIGURA FUNCIONALIDADES */

    configurarCategorias();

    configurarBusca();


    /* MOSTRA PRODUTOS */

    mostrarProdutos();

}


/* =========================================
   AGUARDAR COMPONENTES
========================================= */

document.addEventListener(
    "componentsLoaded",
    iniciarApp
);