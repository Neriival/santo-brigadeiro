/* =========================================================
   COMPONENTES - SANTO BRIGADEIRO
========================================================= */


/* =========================================================
   CARREGAR COMPONENTE
========================================================= */

async function carregarComponente(
    caminho,
    containerId
) {

    try {

        const resposta =
            await fetch(caminho);


        if (!resposta.ok) {

            throw new Error(
                `Erro ao carregar ${caminho}`
            );

        }


        const html =
            await resposta.text();


        const container =
            document.getElementById(
                containerId
            );


        if (container) {

            container.innerHTML =
                html;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar componente:",
            erro
        );

    }

}


/* =========================================================
   CARREGAR SCRIPT
========================================================= */

function carregarScript(caminho) {

    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement(
                    "script"
                );


            script.src =
                caminho;


            script.onload =
                resolve;


            script.onerror =
                reject;


            document.body.appendChild(
                script
            );

        }
    );

}


/* =========================================================
   INICIAR COMPONENTES
========================================================= */

async function iniciarComponentes() {


    /* HEADER */

    await carregarComponente(
        "sections/header.html",
        "header-container"
    );


    /* HOME */

    await carregarComponente(
        "sections/home.html",
        "home-container"
    );


    /* NAVEGAÇÃO */

    await carregarComponente(
        "sections/bottom-navigation.html",
        "navigation-container"
    );


    /* MODAL DO PRODUTO */

    await carregarComponente(
        "sections/modal-produto.html",
        "modal-produto-container"
    );


    /* CARRINHO */

    await carregarComponente(
        "sections/carrinho.html",
        "carrinho-container"
    );


    /* FINALIZAR PEDIDO */

    await carregarComponente(
        "sections/finalizar-pedido.html",
        "checkout-container"
    );

    /* REVISAR PEDIDO */

    await carregarComponente(
        "sections/revisar-pedido.html",
        "review-container"
    );


    /* =====================================================
       AVISA O APP QUE O HTML ESTÁ PRONTO
    ===================================================== */

    document.dispatchEvent(
        new Event(
            "componentsLoaded"
        )
    );


    /* =====================================================
       MODAL DO PRODUTO
    ===================================================== */

    await carregarScript(
        "js/modal-produto.js"
    );


    /* =====================================================
       CARRINHO
    ===================================================== */

    await carregarScript(
        "js/carrinho.js"
    );


    /* =====================================================
       TAXAS DE ENTREGA

       IMPORTANTE:
       Precisa carregar ANTES de finalizar-pedido.js
    ===================================================== */

    await carregarScript(
        "js/taxas-entrega.js"
    );


    /* =====================================================
       FINALIZAR PEDIDO
    ===================================================== */

    await carregarScript(
        "js/finalizar-pedido.js"
    );

    /* =====================================================
       REVISAR PEDIDO
    ===================================================== */

    await carregarScript(
        "js/revisar-pedido.js"
    );

}


/* =========================================================
   INICIAR
========================================================= */

iniciarComponentes();