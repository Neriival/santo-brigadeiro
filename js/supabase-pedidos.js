/* =========================================================
   SUPABASE - PEDIDOS
   SANTO BRIGADEIRO
========================================================= */


/* =========================================================
   MONTAR ENDEREÇO
========================================================= */

function montarEnderecoSupabase(pedido) {

    if (
        pedido.recebimento !== "entrega" ||
        !pedido.endereco
    ) {
        return null;
    }

    const endereco = pedido.endereco;

    let texto =
        `${endereco.rua}, ${endereco.numero}`;

    if (endereco.complemento) {
        texto += ` - ${endereco.complemento}`;
    }

    if (endereco.bairro) {
        texto += ` - ${endereco.bairro}`;
    }

    return texto;
}


/* =========================================================
   CONFIGURAÇÃO DO PRODUTO
========================================================= */

function montarConfiguracaoProduto(item) {

    const configuracao = {};

    /* BOLO */

    if (item.tamanho) {
        configuracao.tamanho = item.tamanho;
    }

    if (item.massa) {
        configuracao.massa = item.massa;
    }

    if (
        item.recheios &&
        item.recheios.length > 0
    ) {
        configuracao.recheios = item.recheios;
    }


    /* DOCES */

    if (item.categoria === "doces") {

        configuracao.quantidadeDoces =
            item.quantidadeDoces || null;

        configuracao.linhaDoces =
            item.linhaDoces || null;

        configuracao.saboresDoces =
            item.saboresDoces || [];
    }


    /* SALGADOS */

    if (item.categoria === "salgados") {

        configuracao.quantidadeSalgados =
            item.quantidadeSalgados || null;

        configuracao.linhaSalgados =
            item.linhaSalgados || null;

        configuracao.preparoSalgados =
            item.preparoSalgados || null;

        configuracao.saboresSalgados =
            item.saboresSalgados || [];
    }


    /* KIT FESTA */

    if (item.tipoConfiguracao === "kit-festa") {

        configuracao.tipoConfiguracao =
            item.tipoConfiguracao;

        configuracao.kitNome =
            item.kitNome || null;

        configuracao.kitServe =
            item.kitServe || null;

        configuracao.kitBoloKg =
            item.kitBoloKg || null;

        configuracao.kitDoces =
            item.kitDoces || null;

        configuracao.kitSalgados =
            item.kitSalgados || null;

        configuracao.saboresDocesKit =
            item.saboresDocesKit || [];

        configuracao.saboresSalgadosKit =
            item.saboresSalgadosKit || [];
    }


    /* FOTO DE INSPIRAÇÃO */

    if (item.temInspiracao) {
        configuracao.temInspiracao = true;
    }


    return configuracao;
}


/* =========================================================
   PREPARAR ITENS PARA O SUPABASE
========================================================= */

function montarItensSupabase(produtos) {

    if (
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {
        throw new Error(
            "O pedido não possui produtos."
        );
    }

    return produtos.map(item => {

        const produtoId =
            item.produtoId ?? item.id ?? null;

        return {

            produto_id:
                produtoId,

            nome_produto:
                item.nome || "Produto",

            categoria:
                item.categoria || null,

            quantidade:
                Number(item.quantidade || 1),

            preco_unitario:
                Number(
                    item.precoUnitario ??
                    item.total ??
                    0
                ),

            total_item:
                Number(item.total || 0),

            configuracao:
                montarConfiguracaoProduto(item),

            observacao:
                item.observacao || null
        };
    });
}


/* =========================================================
   CRIAR PEDIDO COMPLETO
========================================================= */

async function criarPedidoSupabase(pedido) {

    const endereco =
        montarEnderecoSupabase(pedido);

    const troco =
        pedido.pagamento?.precisaTroco
            ? Number(
                pedido.pagamento.trocoPara
            )
            : null;

    const itens =
        montarItensSupabase(
            pedido.produtos
        );


    const { data, error } =
        await supabaseClient.rpc(
            "criar_pedido",
            {

                p_nome_cliente:
                    pedido.cliente.nome,

                p_telefone:
                    pedido.cliente.telefone,

                p_tipo_recebimento:
                    pedido.recebimento,

                p_endereco:
                    endereco,

                p_data_encomenda:
                    pedido.data,

                p_horario:
                    pedido.horario,

                p_forma_pagamento:
                    pedido.pagamento?.tipo || null,

                p_troco_para:
                    troco,

                p_observacao:
                    pedido.observacao || null,

                p_subtotal:
                    Number(
                        pedido.valores.subtotal
                    ),

                p_taxa_entrega:
                    Number(
                        pedido.valores.taxaEntrega
                    ),

                p_total:
                    Number(
                        pedido.valores.total
                    ),

                /* AGORA OS PRODUTOS VÃO JUNTO */

                p_itens:
                    itens
            }
        );


    if (error) {

        console.error(
            "Erro ao criar pedido:",
            error
        );

        throw error;
    }


    if (!data || data.length === 0) {

        throw new Error(
            "O Supabase não retornou o pedido criado."
        );
    }


    return data[0];
}


/* =========================================================
   SALVAR PEDIDO COMPLETO
========================================================= */

async function salvarPedidoSupabase(pedido) {

    try {

        if (!pedido) {

            throw new Error(
                "Dados do pedido não encontrados."
            );
        }


        /* ===============================================
           EVITA CADASTRAR O MESMO PEDIDO DUAS VEZES

           Se já existe ID e número, significa que ele
           já foi salvo anteriormente no Supabase.
        =============================================== */

        if (
            pedido.id &&
            pedido.numeroPedido
        ) {

            console.log(
                "Pedido já salvo:",
                pedido.numeroPedido
            );

            return {

                sucesso: true,

                id:
                    pedido.id,

                numeroPedido:
                    pedido.numeroPedido,

                jaSalvo: true
            };
        }


        /* ===============================================
           CRIA PEDIDO + PRODUTOS DE UMA VEZ
        =============================================== */

        const pedidoCriado =
            await criarPedidoSupabase(
                pedido
            );


        /* ===============================================
           GUARDA ID E NÚMERO NO PEDIDO ATUAL
        =============================================== */

        pedido.id =
            pedidoCriado.id;

        pedido.numeroPedido =
            pedidoCriado.numero_pedido;


        console.log(
            "Pedido salvo com sucesso:",
            pedidoCriado
        );


        return {

            sucesso: true,

            id:
                pedidoCriado.id,

            numeroPedido:
                pedidoCriado.numero_pedido,

            jaSalvo: false
        };


    } catch (erro) {

        console.error(
            "Erro ao salvar pedido no Supabase:",
            erro
        );


        return {

            sucesso: false,

            erro
        };
    }
}