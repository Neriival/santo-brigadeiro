/* =========================================================
   FINALIZAR PEDIDO - SANTO BRIGADEIRO
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const checkoutOverlay =
    document.getElementById("checkoutOverlay");

const checkoutBack =
    document.getElementById("checkoutBack");

const checkoutClose =
    document.getElementById("checkoutClose");

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutDeliveryFee =
    document.getElementById("checkoutDeliveryFee");

const deliveryFeeRow =
    document.getElementById("deliveryFeeRow");

const deliveryFeeLabel =
    document.getElementById("deliveryFeeLabel");

const checkoutAddress =
    document.getElementById("checkoutAddress");

const customerNeighborhood =
    document.getElementById("customerNeighborhood");

const deliveryOptions =
    document.querySelectorAll(".delivery-option");

const paymentOptions = document.querySelectorAll(".payment-option");
const pixPaymentDetail = document.getElementById("pixPaymentDetail");
const cashPaymentDetail = document.getElementById("cashPaymentDetail");
const creditPaymentDetail = document.getElementById("creditPaymentDetail");
const needsChange = document.getElementById("needsChange");
const changeForField = document.getElementById("changeForField");
const changeFor = document.getElementById("changeFor");


/* =========================================================
   CONTROLE
========================================================= */

let tipoEntrega = "retirada";
let formaPagamento = "pix";


/* =========================================================
   FORMATAR DINHEIRO
========================================================= */

function formatarDinheiroCheckout(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   CARREGAR BAIRROS
========================================================= */

function carregarBairros() {

    if (!customerNeighborhood) {
        return;
    }


    if (typeof taxasEntrega === "undefined") {

        console.error(
            "As taxas de entrega não foram carregadas."
        );

        return;

    }


    customerNeighborhood.innerHTML = `
        <option value="">
            Selecione seu bairro
        </option>
    `;


    Object.entries(taxasEntrega)
        .forEach(([id, bairro]) => {

            const option =
                document.createElement("option");


            option.value = id;


            option.textContent =
                `${bairro.nome} - ${formatarDinheiroCheckout(
                    bairro.valor
                )}`;


            customerNeighborhood.appendChild(
                option
            );

        });

}


/* =========================================================
   PEGAR BAIRRO SELECIONADO
========================================================= */

function obterBairroSelecionado() {

    if (
        !customerNeighborhood ||
        !customerNeighborhood.value
    ) {

        return null;

    }


    if (
        typeof taxasEntrega === "undefined"
    ) {

        return null;

    }


    return taxasEntrega[
        customerNeighborhood.value
    ] || null;

}


/* =========================================================
   TAXA DE ENTREGA
========================================================= */

function obterTaxaEntrega() {

    /*
        RETIRADA NÃO POSSUI TAXA
    */

    if (tipoEntrega !== "entrega") {

        return 0;

    }


    const bairro =
        obterBairroSelecionado();


    /*
        AINDA NÃO ESCOLHEU O BAIRRO
    */

    if (!bairro) {

        return 0;

    }


    /*
        GARANTE TAXA MÍNIMA
    */

    return Math.max(
        Number(bairro.valor) || 0,
        TAXA_MINIMA_ENTREGA
    );

}


/* =========================================================
   CALCULAR SUBTOTAL
========================================================= */

function calcularSubtotalCheckout() {

    if (
        typeof carrinho === "undefined"
    ) {

        return 0;

    }


    return carrinho.reduce(
        (soma, item) => {

            return soma +
                Number(item.total || 0);

        },
        0
    );

}


/* =========================================================
   ATUALIZAR VALORES
========================================================= */

function atualizarTotalCheckout() {

    const subtotal =
        calcularSubtotalCheckout();


    const taxaEntrega =
        obterTaxaEntrega();


    const total =
        subtotal + taxaEntrega;


    /* SUBTOTAL */

    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatarDinheiroCheckout(
                subtotal
            );

    }


    /* TAXA DE ENTREGA */

    if (checkoutDeliveryFee) {

        checkoutDeliveryFee.textContent =
            formatarDinheiroCheckout(
                taxaEntrega
            );

    }


    /* MOSTRAR TAXA SOMENTE EM ENTREGA */

    if (deliveryFeeRow) {

        deliveryFeeRow.style.display =
            tipoEntrega === "entrega"
                ? "flex"
                : "none";

    }


    /* NOME DO BAIRRO NA TAXA */

    if (deliveryFeeLabel) {

        const bairro =
            obterBairroSelecionado();


        if (
            tipoEntrega === "entrega" &&
            bairro
        ) {

            deliveryFeeLabel.textContent =
                `Entrega - ${bairro.nome}`;

        } else {

            deliveryFeeLabel.textContent =
                "Taxa de entrega";

        }

    }


    /* TOTAL */

    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatarDinheiroCheckout(
                total
            );

    }

}


/* =========================================================
   ABRIR CHECKOUT
========================================================= */

function abrirCheckout() {

    if (!checkoutOverlay) {
        return;
    }


    if (
        typeof carrinho === "undefined" ||
        carrinho.length === 0
    ) {

        alert(
            "Seu carrinho está vazio."
        );

        return;

    }


    atualizarTotalCheckout();


    /*
        FECHAR CARRINHO
    */

    if (
        typeof fecharCarrinho ===
        "function"
    ) {

        fecharCarrinho();

    }


    checkoutOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR CHECKOUT
========================================================= */

function fecharCheckout() {

    if (!checkoutOverlay) {
        return;
    }


    checkoutOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   VOLTAR PARA CARRINHO
========================================================= */

function voltarCarrinho() {

    fecharCheckout();


    if (
        typeof abrirCarrinho ===
        "function"
    ) {

        abrirCarrinho();

    }

}


/* =========================================================
   RETIRADA / ENTREGA
========================================================= */

deliveryOptions.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                /*
                    REMOVE SELEÇÃO
                */

                deliveryOptions.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                    MARCA BOTÃO
                */

                botao.classList.add(
                    "active"
                );


                /*
                    SALVA TIPO
                */

                tipoEntrega =
                    botao.dataset.delivery;


                /*
                    ENTREGA
                */

                if (
                    tipoEntrega === "entrega"
                ) {

                    checkoutAddress
                        ?.classList.add(
                            "active"
                        );

                }


                /*
                    RETIRADA
                */

                else {

                    checkoutAddress
                        ?.classList.remove(
                            "active"
                        );

                }


                /*
                    RECALCULA
                */

                atualizarTotalCheckout();

            }
        );

    }
);


/* =========================================================
   PAGAMENTO
========================================================= */
paymentOptions.forEach(botao => {
    botao.addEventListener("click", () => {
        paymentOptions.forEach(item => item.classList.remove("active"));
        botao.classList.add("active");
        formaPagamento = botao.dataset.payment;
        if (pixPaymentDetail) pixPaymentDetail.hidden = formaPagamento !== "pix";
        if (cashPaymentDetail) cashPaymentDetail.hidden = formaPagamento !== "dinheiro";
        if (creditPaymentDetail) creditPaymentDetail.hidden = formaPagamento !== "credito";
    });
});
needsChange?.addEventListener("change", () => {
    if (changeForField) changeForField.hidden = !needsChange.checked;
    if (!needsChange.checked && changeFor) changeFor.value = "";
});

/* =========================================================
   ALTERAR BAIRRO
========================================================= */

if (customerNeighborhood) {

    customerNeighborhood.addEventListener(
        "change",
        () => {

            atualizarTotalCheckout();

        }
    );

}


/* =========================================================
   VOLTAR
========================================================= */

if (checkoutBack) {

    checkoutBack.addEventListener(
        "click",
        voltarCarrinho
    );

}


/* =========================================================
   FECHAR
========================================================= */

if (checkoutClose) {

    checkoutClose.addEventListener(
        "click",
        fecharCheckout
    );

}


/* =========================================================
   CLICAR FORA
========================================================= */

if (checkoutOverlay) {

    checkoutOverlay.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                checkoutOverlay
            ) {

                fecharCheckout();

            }

        }
    );

}


/* =========================================================
   TECLA ESC
========================================================= */

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            checkoutOverlay
                ?.classList.contains(
                    "active"
                )
        ) {

            fecharCheckout();

        }

    }
);


/* =========================================================
   FORMULÁRIO
========================================================= */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            /* =============================================
               DADOS DO CLIENTE
            ============================================= */

            const nome =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const telefone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const data =
                document
                    .getElementById(
                        "orderDate"
                    )
                    .value;


            const horario =
                document
                    .getElementById(
                        "orderTime"
                    )
                    .value;


            const observacao =
                document
                    .getElementById(
                        "orderObservation"
                    )
                    ?.value
                    .trim() || "";

            const precisaTroco = formaPagamento === "dinheiro" && Boolean(needsChange?.checked);
            const trocoPara = precisaTroco ? Number(changeFor?.value || 0) : 0;


            /* =============================================
               CAMPOS OBRIGATÓRIOS
            ============================================= */

            if (
                !nome ||
                !telefone ||
                !data ||
                !horario
            ) {

                alert(
                    "Preencha os campos obrigatórios."
                );

                return;

            }


            if (precisaTroco && (!trocoPara || trocoPara <= 0)) {
                alert("Informe para qual valor precisa de troco.");
                changeFor?.focus();
                return;
            }

            /* =============================================
               ENDEREÇO
            ============================================= */

            let endereco = null;


            if (
                tipoEntrega === "entrega"
            ) {

                const bairro =
                    obterBairroSelecionado();


                if (!bairro) {

                    alert(
                        "Selecione o bairro para entrega."
                    );

                    customerNeighborhood
                        ?.focus();

                    return;

                }


                const rua =
                    document
                        .getElementById(
                            "customerStreet"
                        )
                        .value
                        .trim();


                const numero =
                    document
                        .getElementById(
                            "customerNumber"
                        )
                        .value
                        .trim();


                const complemento =
                    document
                        .getElementById(
                            "customerComplement"
                        )
                        ?.value
                        .trim() || "";


                if (
                    !rua ||
                    !numero
                ) {

                    alert(
                        "Preencha a rua e o número para entrega."
                    );

                    return;

                }


                endereco = {

                    bairroId:
                        customerNeighborhood
                            .value,

                    bairro:
                        bairro.nome,

                    rua,

                    numero,

                    complemento

                };

            }


            /* =============================================
               VALORES
            ============================================= */

            const subtotal =
                calcularSubtotalCheckout();


            const taxaEntrega =
                obterTaxaEntrega();


            const total =
                subtotal + taxaEntrega;


            /* =============================================
               SALVAR DADOS DO PEDIDO
            ============================================= */

            window.dadosPedido = {

                cliente: {
                    nome,
                    telefone
                },

                recebimento:
                    tipoEntrega,

                endereco,

                data,

                horario,

                observacao,

                pagamento: {
                    tipo: formaPagamento,
                    nome: formaPagamento === "pix" ? "PIX" : formaPagamento === "dinheiro" ? "Dinheiro" : "Crédito por link",
                    precisaTroco,
                    trocoPara: precisaTroco ? trocoPara : null
                },

                valores: {

                    subtotal,

                    taxaEntrega,

                    total

                },

                produtos:
                    typeof carrinho !==
                    "undefined"
                        ? carrinho
                        : []

            };


            /* =============================================
               TESTE NO CONSOLE
            ============================================= */

            console.log(
                "Pedido pronto:",
                window.dadosPedido
            );


            /* =============================================
            PRÓXIMA ETAPA - REVISAR PEDIDO
            ============================================= */

            if (
                typeof abrirRevisaoPedido ===
                "function"
            ) {

                abrirRevisaoPedido();

            } else {

                console.error(
                    "A tela de revisão ainda não foi carregada."
                );

            }

        }
    );

}


/* =========================================================
   INICIAR
========================================================= */

carregarBairros();

atualizarTotalCheckout();