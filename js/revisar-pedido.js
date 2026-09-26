/* =========================================================
   REVISAR PEDIDO - SANTO BRIGADEIRO
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const reviewOverlay =
    document.getElementById("reviewOverlay");

const reviewBack =
    document.getElementById("reviewBack");

const reviewClose =
    document.getElementById("reviewClose");

const reviewEdit =
    document.getElementById("reviewEdit");

const reviewWhatsapp =
    document.getElementById("reviewWhatsapp");

const reviewCustomerName =
    document.getElementById("reviewCustomerName");

const reviewCustomerPhone =
    document.getElementById("reviewCustomerPhone");

const reviewDeliveryType =
    document.getElementById("reviewDeliveryType");

const reviewAddress =
    document.getElementById("reviewAddress");

const reviewNeighborhood =
    document.getElementById("reviewNeighborhood");

const reviewStreet =
    document.getElementById("reviewStreet");

const reviewComplementRow =
    document.getElementById("reviewComplementRow");

const reviewComplement =
    document.getElementById("reviewComplement");

const reviewDate =
    document.getElementById("reviewDate");

const reviewTime =
    document.getElementById("reviewTime");

const reviewProducts =
    document.getElementById("reviewProducts");

const reviewObservationSection =
    document.getElementById(
        "reviewObservationSection"
    );

const reviewObservation =
    document.getElementById(
        "reviewObservation"
    );

const reviewSubtotal =
    document.getElementById("reviewSubtotal");

const reviewDeliveryFeeRow =
    document.getElementById(
        "reviewDeliveryFeeRow"
    );

const reviewDeliveryFee =
    document.getElementById(
        "reviewDeliveryFee"
    );

const reviewTotal =
    document.getElementById("reviewTotal");


/* =========================================================
   FORMATAR DINHEIRO
========================================================= */

function formatarDinheiroReview(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarDataReview(data) {

    if (!data) {
        return "-";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =========================================================
   CRIAR DETALHES DO PRODUTO
========================================================= */

function criarDetalhesProdutoReview(item) {

    const detalhes = [];


    /* TAMANHO */

    if (item.tamanho) {

        detalhes.push(`
            <p>
                <strong>Tamanho:</strong>
                ${item.tamanho}
            </p>
        `);

    }


    /* MASSA */

    if (item.massa) {

        detalhes.push(`
            <p>
                <strong>Massa:</strong>
                ${item.massa}
            </p>
        `);

    }


    /* RECHEIOS */

    if (
        item.recheios &&
        item.recheios.length > 0
    ) {

        const nomesRecheios =
            item.recheios
                .map(recheio => {

                    if (
                        typeof recheio ===
                        "string"
                    ) {

                        return recheio;

                    }

                    return recheio.nome;

                })
                .join(", ");


        detalhes.push(`
            <p>
                <strong>Recheios:</strong>
                ${nomesRecheios}
            </p>
        `);

    }


    /* DOCINHOS */

    if (item.categoria === "doces") {

        detalhes.push(`
            <p><strong>Quantidade:</strong> ${item.quantidadeDoces} doces</p>
            <p><strong>Linha:</strong> ${item.linhaDoces}</p>
            <p><strong>Sabores:</strong> ${(item.saboresDoces || []).join(", ")}</p>
        `);

    }

    if (item.categoria === "salgados") {
        detalhes.push(`
            <p><strong>Quantidade:</strong> ${item.quantidadeSalgados} salgados</p>
            <p><strong>Linha:</strong> ${item.linhaSalgados}</p>
            <p><strong>Preparo:</strong> ${item.preparoSalgados}</p>
            <p><strong>Sabores:</strong> ${(item.saboresSalgados || []).join(", ")}</p>
        `);
    }


    if (item.tipoConfiguracao === "kit-festa") {
        detalhes.push(`
            <p><strong>Kit:</strong> ${item.kitNome} - serve ${item.kitServe} pessoas</p>
            <p><strong>Bolo:</strong> ${String(item.kitBoloKg).replace(".", ",")}kg</p>
            <p><strong>Doces comuns:</strong> ${item.kitDoces} - ${(item.saboresDocesKit || []).join(", ")}</p>
            <p><strong>Salgados fritos:</strong> ${item.kitSalgados} - ${(item.saboresSalgadosKit || []).join(", ")}</p>
        `);
    }


    /* OBSERVAÇÃO DO PRODUTO */

    if (item.observacao) {

        detalhes.push(`
            <p>
                <strong>Observação:</strong>
                ${item.observacao}
            </p>
        `);

    }


    return detalhes.join("");

}


/* =========================================================
   RENDERIZAR PRODUTOS
========================================================= */

function renderizarProdutosReview(produtos) {

    if (!reviewProducts) {
        return;
    }


    reviewProducts.innerHTML = "";


    if (
        !produtos ||
        produtos.length === 0
    ) {

        reviewProducts.innerHTML = `
            <p>
                Nenhum produto encontrado.
            </p>
        `;

        return;

    }


    produtos.forEach(item => {

        const produto =
            document.createElement("div");


        produto.classList.add(
            "review-product"
        );


        produto.innerHTML = `
            <div class="review-product-header">

                <strong>
                    ${item.quantidade}x
                    ${item.nome}
                </strong>

                <span class="review-product-price">
                    ${formatarDinheiroReview(
                        item.total
                    )}
                </span>

            </div>

            <div class="review-product-details">

                ${criarDetalhesProdutoReview(
                    item
                )}

            </div>
        `;


        reviewProducts.appendChild(
            produto
        );

    });

}


/* =========================================================
   PREENCHER REVISÃO
========================================================= */

function preencherRevisaoPedido() {

    const pedido =
        window.dadosPedido;


    if (!pedido) {

        console.error(
            "Nenhum pedido encontrado para revisão."
        );

        return false;

    }


    /* =====================================================
       CLIENTE
    ===================================================== */

    if (reviewCustomerName) {

        reviewCustomerName.textContent =
            pedido.cliente?.nome || "-";

    }


    if (reviewCustomerPhone) {

        reviewCustomerPhone.textContent =
            pedido.cliente?.telefone || "-";

    }


    /* =====================================================
       RECEBIMENTO
    ===================================================== */

    if (reviewDeliveryType) {

        reviewDeliveryType.textContent =
            pedido.recebimento === "entrega"
                ? "Entrega"
                : "Retirada";

    }


    /* =====================================================
       ENDEREÇO
    ===================================================== */

    if (
        pedido.recebimento === "entrega" &&
        pedido.endereco
    ) {

        if (reviewAddress) {

            reviewAddress.style.display =
                "block";

        }


        if (reviewNeighborhood) {

            reviewNeighborhood.textContent =
                pedido.endereco.bairro || "-";

        }


        if (reviewStreet) {

            reviewStreet.textContent =
                `${pedido.endereco.rua}, ${pedido.endereco.numero}`;

        }


        if (pedido.endereco.complemento) {

            if (reviewComplementRow) {

                reviewComplementRow.style.display =
                    "flex";

            }


            if (reviewComplement) {

                reviewComplement.textContent =
                    pedido.endereco.complemento;

            }

        } else {

            if (reviewComplementRow) {

                reviewComplementRow.style.display =
                    "none";

            }

        }

    } else {

        if (reviewAddress) {

            reviewAddress.style.display =
                "none";

        }

    }


    /* =====================================================
       DATA E HORÁRIO
    ===================================================== */

    if (reviewDate) {

        reviewDate.textContent =
            formatarDataReview(
                pedido.data
            );

    }


    if (reviewTime) {

        reviewTime.textContent =
            pedido.horario || "-";

    }


    /* =====================================================
       PRODUTOS
    ===================================================== */

    renderizarProdutosReview(
        pedido.produtos
    );


    /* =====================================================
       OBSERVAÇÃO GERAL
    ===================================================== */

    if (pedido.observacao) {

        if (reviewObservationSection) {

            reviewObservationSection.style.display =
                "block";

        }


        if (reviewObservation) {

            reviewObservation.textContent =
                pedido.observacao;

        }

    } else {

        if (reviewObservationSection) {

            reviewObservationSection.style.display =
                "none";

        }

    }


    /* =====================================================
       VALORES
    ===================================================== */

    const subtotal =
        pedido.valores?.subtotal || 0;

    const taxaEntrega =
        pedido.valores?.taxaEntrega || 0;

    const total =
        pedido.valores?.total || 0;


    if (reviewSubtotal) {

        reviewSubtotal.textContent =
            formatarDinheiroReview(
                subtotal
            );

    }


    if (reviewDeliveryFee) {

        reviewDeliveryFee.textContent =
            formatarDinheiroReview(
                taxaEntrega
            );

    }


    if (reviewTotal) {

        reviewTotal.textContent =
            formatarDinheiroReview(
                total
            );

    }


    /*
        MOSTRA TAXA SOMENTE
        QUANDO FOR ENTREGA
    */

    if (reviewDeliveryFeeRow) {

        reviewDeliveryFeeRow.style.display =
            pedido.recebimento === "entrega"
                ? "flex"
                : "none";

    }


    return true;

}


/* =========================================================
   ABRIR REVISÃO
========================================================= */

function abrirRevisaoPedido() {

    if (!reviewOverlay) {
        return;
    }


    const pedidoValido =
        preencherRevisaoPedido();


    if (!pedidoValido) {

        alert(
            "Não foi possível carregar os dados do pedido."
        );

        return;

    }


    /*
        FECHA CHECKOUT
    */

    if (
        typeof fecharCheckout ===
        "function"
    ) {

        fecharCheckout();

    }


    /*
        ABRE REVISÃO
    */

    reviewOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR REVISÃO
========================================================= */

function fecharRevisaoPedido() {

    if (!reviewOverlay) {
        return;
    }


    reviewOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   VOLTAR PARA CHECKOUT
========================================================= */

function voltarParaCheckout() {

    fecharRevisaoPedido();


    if (
        typeof abrirCheckout ===
        "function"
    ) {

        abrirCheckout();

    }

}


/* =========================================================
   BOTÃO VOLTAR
========================================================= */

if (reviewBack) {

    reviewBack.addEventListener(
        "click",
        voltarParaCheckout
    );

}


/* =========================================================
   BOTÃO EDITAR DADOS
========================================================= */

if (reviewEdit) {

    reviewEdit.addEventListener(
        "click",
        voltarParaCheckout
    );

}


/* =========================================================
   BOTÃO FECHAR
========================================================= */

if (reviewClose) {

    reviewClose.addEventListener(
        "click",
        fecharRevisaoPedido
    );

}


/* =========================================================
   CLICAR FORA
========================================================= */

if (reviewOverlay) {

    reviewOverlay.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                reviewOverlay
            ) {

                fecharRevisaoPedido();

            }

        }
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            reviewOverlay
                ?.classList.contains(
                    "active"
                )
        ) {

            fecharRevisaoPedido();

        }

    }
);


/* =========================================================
   WHATSAPP
========================================================= */

const WHATSAPP_SANTO_BRIGADEIRO =
    "5513991618803";


/* =========================================================
   MONTAR PRODUTOS PARA WHATSAPP
========================================================= */

function montarProdutosWhatsapp(produtos) {

    if (
        !produtos ||
        produtos.length === 0
    ) {

        return "";

    }


    return produtos
        .map(item => {

            let texto = "";

            texto +=
                `\n*${item.quantidade}x ${item.nome}*\n`;


            /* TAMANHO */

            if (item.tamanho) {

                texto +=
                    `Tamanho: ${item.tamanho}\n`;

            }


            /* MASSA */

            if (item.massa) {

                texto +=
                    `Massa: ${item.massa}\n`;

            }


            /* RECHEIOS */

            if (
                item.recheios &&
                item.recheios.length > 0
            ) {

                const recheios =
                    item.recheios
                        .map(recheio => {

                            if (
                                typeof recheio ===
                                "string"
                            ) {

                                return recheio;

                            }

                            return recheio.nome;

                        })
                        .join(", ");


                texto +=
                    `Recheios: ${recheios}\n`;

            }


            /* DOCINHOS */

            if (item.categoria === "doces") {

                texto += `Quantidade: ${item.quantidadeDoces} doces\n`;
                texto += `Linha: ${item.linhaDoces}\n`;
                texto += `Sabores: ${(item.saboresDoces || []).join(", ")}\n`;

            }

            if (item.categoria === "salgados") {
                texto += `Quantidade: ${item.quantidadeSalgados} salgados\n`;
                texto += `Linha: ${item.linhaSalgados}\n`;
                texto += `Preparo: ${item.preparoSalgados}\n`;
                texto += `Sabores: ${(item.saboresSalgados || []).join(", ")}\n`;
            }


            if (item.tipoConfiguracao === "kit-festa") {
                texto += `Kit: ${item.kitNome} - serve ${item.kitServe} pessoas\n`;
                texto += `Bolo: ${String(item.kitBoloKg).replace(".", ",")}kg\n`;
                texto += `Doces comuns: ${item.kitDoces} - ${(item.saboresDocesKit || []).join(", ")}\n`;
                texto += `Salgados fritos: ${item.kitSalgados} - ${(item.saboresSalgadosKit || []).join(", ")}\n`;
                texto += `Topo: cobrado à parte\n`;
            }


            /* OBSERVAÇÃO DO PRODUTO */

            if (item.observacao) {

                texto +=
                    `Observação: ${item.observacao}\n`;

            }


            /* VALOR */

            texto +=
                `Valor: ${formatarDinheiroReview(
                    item.total
                )}\n`;


            return texto;

        })
        .join("\n");

}


/* =========================================================
   MONTAR MENSAGEM
========================================================= */

function montarMensagemWhatsapp() {

    const pedido =
        window.dadosPedido;


    if (!pedido) {

        return null;

    }


    let mensagem = "";


    /* CABEÇALHO */

    mensagem +=
        `Olá! Gostaria de fazer um pedido na *Santo Brigadeiro* 💙\n\n`;


    /* CLIENTE */

    mensagem +=
        `👤 *CLIENTE*\n`;

    mensagem +=
        `Nome: ${pedido.cliente.nome}\n`;

    mensagem +=
        `WhatsApp: ${pedido.cliente.telefone}\n\n`;


    /* RECEBIMENTO */

    mensagem +=
        `📦 *RECEBIMENTO*\n`;


    if (
        pedido.recebimento ===
        "entrega"
    ) {

        mensagem +=
            `Forma: Entrega\n`;


        if (pedido.endereco) {

            mensagem +=
                `Bairro: ${pedido.endereco.bairro}\n`;

            mensagem +=
                `Endereço: ${pedido.endereco.rua}, ${pedido.endereco.numero}\n`;


            if (
                pedido.endereco.complemento
            ) {

                mensagem +=
                    `Complemento: ${pedido.endereco.complemento}\n`;

            }

        }

    } else {

        mensagem +=
            `Forma: Retirada\n`;

    }


    /* DATA */

    mensagem +=
        `\n📅 *DATA E HORÁRIO*\n`;

    mensagem +=
        `Data: ${formatarDataReview(
            pedido.data
        )}\n`;

    mensagem +=
        `Horário: ${pedido.horario}\n`;


    /* PRODUTOS */

    mensagem +=
        `\n🎂 *PEDIDO*\n`;

    mensagem +=
        montarProdutosWhatsapp(
            pedido.produtos
        );


    /* OBSERVAÇÃO GERAL */

    if (pedido.observacao) {

        mensagem +=
            `\n📝 *OBSERVAÇÃO GERAL*\n`;

        mensagem +=
            `${pedido.observacao}\n`;

    }


    /* VALORES */

    mensagem +=
        `\n💰 *VALORES*\n`;

    mensagem +=
        `Subtotal: ${formatarDinheiroReview(
            pedido.valores.subtotal
        )}\n`;


    if (
        pedido.recebimento ===
        "entrega"
    ) {

        mensagem +=
            `Taxa de entrega: ${formatarDinheiroReview(
                pedido.valores.taxaEntrega
            )}\n`;

    }


    mensagem +=
        `\n*TOTAL: ${formatarDinheiroReview(
            pedido.valores.total
        )}*`;


    return mensagem;

}


/* =========================================================
   ENVIAR PARA WHATSAPP
========================================================= */

if (reviewWhatsapp) {

    reviewWhatsapp.addEventListener(
        "click",
        () => {

            const mensagem =
                montarMensagemWhatsapp();


            if (!mensagem) {

                alert(
                    "Não foi possível montar o pedido."
                );

                return;

            }


            const mensagemCodificada =
                encodeURIComponent(
                    mensagem
                );


            const url =
                `https://wa.me/${WHATSAPP_SANTO_BRIGADEIRO}?text=${mensagemCodificada}`;


            window.open(
                url,
                "_blank"
            );

        }
    );

}