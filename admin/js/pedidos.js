const STATUS = {
  novo: 'Novo',
  confirmado: 'Confirmado',
  em_producao: 'Em produção',
  pronto: 'Pronto',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado'
};

let pedidosAdmin = [];

const dinheiro = valor =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

const escapar = valor =>
  String(valor ?? '').replace(
    /[&<>'"]/g,
    c =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[c])
  );

const dataBR = valor =>
  valor
    ? new Date(`${valor}T12:00:00`).toLocaleDateString('pt-BR')
    : '-';

const dataHoraBR = valor =>
  valor ? new Date(valor).toLocaleString('pt-BR') : '-';

const normalizarStatus = valor =>
  String(valor || 'novo')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace('produção', 'producao');


async function carregarPedidos() {

  const { data, error } = await supabaseClient
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  pedidosAdmin = data || [];

  renderizarTudo();
}


function numeroPedido(p) {
  return p.numero_pedido || `#${p.id}`;
}


function cardPedido(p) {

  const st = normalizarStatus(p.status);

  return `
    <article class="order-card" data-order-id="${p.id}">

      <div class="order-main">

        <div class="order-number">
          ${escapar(numeroPedido(p))}
        </div>

        <h3>${escapar(p.nome_cliente)}</h3>

        <p>${escapar(p.telefone || '')}</p>

      </div>

      <div class="order-meta">

        <span>
          ${dataBR(p.data_encomenda)}
          •
          ${escapar((p.horario || '').slice(0, 5))}
        </span>

        <strong>
          ${dinheiro(p.total)}
        </strong>

      </div>

      <span class="status status-${st}">
        ${STATUS[st] || escapar(p.status)}
      </span>

      <button
        class="details-button"
        data-open-order="${p.id}">
        Ver detalhes
      </button>

    </article>
  `;
}


function renderizarTudo() {

  const total = pedidosAdmin.length;

  document.getElementById('statTotal').textContent = total;

  document.getElementById('statNovos').textContent =
    pedidosAdmin.filter(
      p => normalizarStatus(p.status) === 'novo'
    ).length;

  document.getElementById('statProducao').textContent =
    pedidosAdmin.filter(
      p => normalizarStatus(p.status) === 'em_producao'
    ).length;

  document.getElementById('statProntos').textContent =
    pedidosAdmin.filter(
      p => normalizarStatus(p.status) === 'pronto'
    ).length;

  document.getElementById('recentOrders').innerHTML =
    pedidosAdmin
      .slice(0, 5)
      .map(cardPedido)
      .join('') ||
    vazio('Nenhum pedido cadastrado ainda.');

  filtrarPedidos();
}


function vazio(msg) {

  return `
    <div class="empty-state">

      <strong>
        Nada por aqui
      </strong>

      <p>
        ${escapar(msg)}
      </p>

    </div>
  `;
}


function filtrarPedidos() {

  const termo =
    document
      .getElementById('searchInput')
      .value
      .toLowerCase()
      .trim();

  const status =
    document.getElementById('statusFilter').value;

  const filtrados =
    pedidosAdmin.filter(p => {

      const texto =
        `${p.nome_cliente || ''}
         ${p.telefone || ''}
         ${numeroPedido(p)}`
          .toLowerCase();

      return (
        (!termo || texto.includes(termo)) &&
        (
          status === 'todos' ||
          normalizarStatus(p.status) === status
        )
      );

    });

  document.getElementById('ordersCounter').textContent =
    `${filtrados.length} pedido${
      filtrados.length === 1 ? '' : 's'
    }`;

  document.getElementById('ordersList').innerHTML =
    filtrados
      .map(cardPedido)
      .join('') ||
    vazio('Nenhum pedido encontrado com esses filtros.');
}


async function abrirPedido(id) {

  const pedido =
    pedidosAdmin.find(
      p => String(p.id) === String(id)
    );

  if (!pedido) return;

  const { data: itens, error } =
    await supabaseClient
      .from('itens_pedido')
      .select('*')
      .eq('pedido_id', pedido.id)
      .order('id');

  if (error) throw error;

  const st =
    normalizarStatus(pedido.status);

  document.getElementById('orderDetails').innerHTML = `

    <div class="modal-header">

      <span class="eyebrow">
        Pedido ${escapar(numeroPedido(pedido))}
      </span>

      <h2 id="modalTitle">
        ${escapar(pedido.nome_cliente)}
      </h2>

      <p>
        Criado em
        ${dataHoraBR(pedido.created_at)}
      </p>

    </div>


    <div class="detail-grid">

      <div>
        <span>Telefone</span>
        <strong>
          ${escapar(pedido.telefone || '-')}
        </strong>
      </div>

      <div>
        <span>Recebimento</span>
        <strong>
          ${escapar(pedido.tipo_recebimento || '-')}
        </strong>
      </div>

      <div>
        <span>Data</span>
        <strong>
          ${dataBR(pedido.data_encomenda)}
        </strong>
      </div>

      <div>
        <span>Horário</span>
        <strong>
          ${escapar(
            (pedido.horario || '').slice(0, 5) || '-'
          )}
        </strong>
      </div>

      <div>
        <span>Pagamento</span>
        <strong>
          ${escapar(pedido.forma_pagamento || '-')}
        </strong>
      </div>

      <div>
        <span>Total</span>
        <strong>
          ${dinheiro(pedido.total)}
        </strong>
      </div>

    </div>


    ${
      pedido.endereco
        ? `
          <div class="info-box">

            <span>
              Endereço
            </span>

            <p>
              ${escapar(pedido.endereco)}
            </p>

          </div>
        `
        : ''
    }


    ${
      pedido.observacao
        ? `
          <div class="info-box">

            <span>
              Observação
            </span>

            <p>
              ${escapar(pedido.observacao)}
            </p>

          </div>
        `
        : ''
    }


    <div class="items-section">

      <h3>
        Itens do pedido
      </h3>

      ${
        (itens || [])
          .map(itemPedido)
          .join('') ||
        vazio('Nenhum item encontrado.')
      }

    </div>


    <div class="totals">

      <div>
        <span>Subtotal</span>

        <strong>
          ${dinheiro(pedido.subtotal)}
        </strong>
      </div>

      <div>
        <span>Taxa de entrega</span>

        <strong>
          ${dinheiro(pedido.taxa_entrega)}
        </strong>
      </div>

      <div class="grand-total">

        <span>Total</span>

        <strong>
          ${dinheiro(pedido.total)}
        </strong>

      </div>

    </div>


    <div class="status-editor">

      <label for="modalStatus">
        Status do pedido
      </label>

      <div>

        <select id="modalStatus">

          ${Object.entries(STATUS)
            .map(
              ([valor, label]) =>
                `
                <option
                  value="${valor}"
                  ${
                    valor === st
                      ? 'selected'
                      : ''
                  }>
                  ${label}
                </option>
                `
            )
            .join('')}

        </select>

        <button
          class="btn-primary"
          id="saveStatus"
          data-id="${pedido.id}">

          Salvar status

        </button>

      </div>

      <p
        id="statusMessage"
        class="form-message">
      </p>

    </div>
  `;

  document
    .getElementById('orderModal')
    .classList.remove('hidden');
}


/* =========================================
   FORMATA CONFIGURAÇÕES DOS PRODUTOS
========================================= */

function textoOpcao(valor) {

  if (valor == null) return '';

  if (
    typeof valor === 'string' ||
    typeof valor === 'number'
  ) {
    return String(valor);
  }

  if (typeof valor === 'object') {

    const nome =
      valor.nome ||
      valor.label ||
      valor.sabor ||
      valor.titulo ||
      valor.descricao ||
      '';

    const tipo =
      valor.tipo ||
      valor.categoria ||
      '';

    if (
      nome &&
      tipo &&
      !String(nome)
        .toLowerCase()
        .includes(
          String(tipo).toLowerCase()
        )
    ) {
      return `${nome} (${tipo})`;
    }

    return String(nome || tipo || '');
  }

  return String(valor);
}


function listaOpcoes(valores) {

  if (!Array.isArray(valores))
    return '';

  return valores
    .map(textoOpcao)
    .filter(Boolean)
    .join(', ');
}


function itemPedido(i) {

  const cfg =
    i.configuracao || {};

  const detalhes = [];


  if (cfg.tamanho) {

    detalhes.push(
      `Tamanho: ${textoOpcao(cfg.tamanho)}`
    );

  }


  if (cfg.massa) {

    detalhes.push(
      `Massa: ${textoOpcao(cfg.massa)}`
    );

  }


  const recheios =
    listaOpcoes(cfg.recheios);

  if (recheios) {

    detalhes.push(
      `Recheios: ${recheios}`
    );

  }


  const saboresDoces =
    listaOpcoes(cfg.saboresDoces);

  if (saboresDoces) {

    detalhes.push(
      `Sabores: ${saboresDoces}`
    );

  }


  const saboresSalgados =
    listaOpcoes(cfg.saboresSalgados);

  if (saboresSalgados) {

    detalhes.push(
      `Sabores: ${saboresSalgados}`
    );

  }


  if (cfg.kitNome) {

    detalhes.push(
      textoOpcao(cfg.kitNome)
    );

  }


  return `

    <div class="item-row">

      <div>

        <strong>
          ${escapar(i.nome_produto)}
        </strong>

        <span>
          ${escapar(
            detalhes.join(' • ') ||
            i.categoria ||
            ''
          )}
        </span>

        ${
          i.observacao
            ? `
              <small>
                ${escapar(i.observacao)}
              </small>
            `
            : ''
        }

      </div>

      <div>

        <span>
          ${i.quantidade || 1}x
        </span>

        <strong>
          ${dinheiro(i.total_item)}
        </strong>

      </div>

    </div>
  `;
}


async function atualizarStatus(
  id,
  status
) {

  const msg =
    document.getElementById(
      'statusMessage'
    );

  msg.textContent =
    'Salvando...';


  const { error } =
    await supabaseClient
      .from('pedidos')
      .update({ status })
      .eq('id', id);


  if (error) {

    msg.textContent =
      'Não foi possível alterar o status.';

    throw error;
  }


  const pedido =
    pedidosAdmin.find(
      p =>
        String(p.id) ===
        String(id)
    );


  if (pedido) {

    pedido.status =
      status;

  }


  msg.textContent =
    'Status atualizado com sucesso.';


  renderizarTudo();
}