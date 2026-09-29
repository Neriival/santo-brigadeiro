/* =========================================================
   COMPONENTES - SANTO BRIGADEIRO
========================================================= */

async function carregarComponente(caminho, containerId) {
    try {
        const resposta = await fetch(caminho);
        if (!resposta.ok) throw new Error(`Erro ao carregar ${caminho}`);

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = await resposta.text();
    } catch (erro) {
        console.error("Erro ao carregar componente:", erro);
    }
}

function carregarScript(caminho) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = caminho;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

async function iniciarComponentes() {
    await carregarComponente("sections/header.html", "header-container");
    await carregarComponente("sections/home.html", "home-container");
    await carregarComponente("sections/bottom-navigation.html", "navigation-container");
    await carregarComponente("sections/modal-produto.html", "modal-produto-container");
    await carregarComponente("sections/carrinho.html", "carrinho-container");
    await carregarComponente("sections/finalizar-pedido.html", "checkout-container");
    await carregarComponente("sections/revisar-pedido.html", "review-container");

    await carregarCatalogoOnline();

    /* O app precisa do HTML da home antes de configurar categorias/busca. */
    document.dispatchEvent(new Event("componentsLoaded"));

    /* Configuradores separados: modal-produto usa as funções destes arquivos. */
    await carregarScript("js/modal-bolo.js");
    await carregarScript("js/modal-doces.js");
    await carregarScript("js/modal-salgados.js");
    await carregarScript("js/modal-kits.js");
    await carregarScript("js/modal-produto.js");
    await carregarScript("js/carrinho.js");
    await carregarScript("js/taxas-entrega.js");
    await carregarScript("js/finalizar-pedido.js");
    await carregarScript("js/revisar-pedido.js");
}

iniciarComponentes();
