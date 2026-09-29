/* =========================================================
   CLIENTES E LEMBRETES - SANTO BRIGADEIRO
   Acesso restrito por RLS a administradores autenticados.
========================================================= */
let clientesHistorico = [];
let datasHistorico = [];
const escaparCliente = texto => String(texto ?? '').replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function aniversarioNoAno(dataOriginal, ano) {
    const partes = String(dataOriginal).split('-').map(Number);
    const mes = partes[1], dia = partes[2];
    if (!mes || !dia) return null;
    // 29/02 em anos não bissextos: 28/02.
    const d = new Date(ano, mes - 1, dia, 12);
    if (d.getMonth() !== mes - 1) return new Date(ano, 1, 28, 12);
    return d;
}
function proximoAniversario(dataOriginal, hoje) {
    const anoOriginal = Number(String(dataOriginal).slice(0,4));
    let ano = Math.max(hoje.getFullYear(), anoOriginal + 1);
    let d = aniversarioNoAno(dataOriginal, ano);
    if (d && d < hoje) d = aniversarioNoAno(dataOriginal, ++ano);
    return d;
}
function configurarClientesAdmin() {
    document.getElementById('refreshClientes')?.addEventListener('click', carregarClientesAdmin);
    document.getElementById('buscarCliente')?.addEventListener('input', renderizarClientesAdmin);
}
async function carregarClientesAdmin() {
    const lista = document.getElementById('listaClientes');
    const lembretes = document.getElementById('lembretesClientes');
    if (!lista || !lembretes) return;
    lista.textContent = 'Carregando clientes...';
    lembretes.textContent = 'Verificando datas...';
    const [resClientes, resDatas] = await Promise.all([
        supabaseClient.from('clientes').select('id,nome,telefone,primeiro_pedido_em,ultimo_pedido_em,total_pedidos').order('ultimo_pedido_em',{ascending:false}),
        supabaseClient.from('datas_clientes').select('id,cliente_id,data_original,descricao,numero_pedido').order('data_original',{ascending:false})
    ]);
    if (resClientes.error || resDatas.error) {
        const msg = (resClientes.error || resDatas.error).message;
        lista.textContent = 'Não foi possível carregar o histórico: ' + msg;
        lembretes.textContent = 'Confira se executou o SQL de clientes no Supabase.';
        return;
    }
    clientesHistorico = resClientes.data || [];
    datasHistorico = resDatas.data || [];
    renderizarClientesAdmin();
}
function renderizarClientesAdmin() {
    const busca = (document.getElementById('buscarCliente')?.value || '').toLowerCase().trim();
    const lista = document.getElementById('listaClientes');
    const lembretes = document.getElementById('lembretesClientes');
    const porId = new Map(clientesHistorico.map(c => [String(c.id), c]));
    const filtrados = clientesHistorico.filter(c =>
        `${c.nome} ${c.telefone}`.toLowerCase().includes(busca));
    lista.innerHTML = filtrados.map(c => `<article class="cliente-card"><div><strong>${escaparCliente(c.nome)}</strong><p>${escaparCliente(c.telefone)}</p><small>${Number(c.total_pedidos)||0} pedido(s) · Último: ${escaparCliente(c.ultimo_pedido_em || '-')}</small></div></article>`).join('') || '<p>Nenhum cliente encontrado.</p>';
    const agora = new Date(); agora.setHours(12,0,0,0);
    const avisos = datasHistorico.map(item => {
        const cliente = porId.get(String(item.cliente_id));
        if (!cliente) return null;
        const aniversario = proximoAniversario(item.data_original, agora);
        if (!aniversario) return null;
        const dias = Math.round((aniversario - agora)/86400000);
        return {cliente, item, aniversario, dias};
    }).filter(a => a && a.dias >= 23 && a.dias <= 37)
      .sort((a,b) => a.dias - b.dias);
    lembretes.innerHTML = avisos.map(a => `<article class="cliente-card lembrete-card"><div><strong>${escaparCliente(a.cliente.nome)}</strong><p>Encomenda anterior: ${escaparCliente(a.item.descricao || 'Encomenda')} · ${escaparCliente(a.item.numero_pedido || '')}</p><small>Aniversário da encomenda: ${a.aniversario.toLocaleDateString('pt-BR')} (daqui a ${a.dias} dias)</small></div><span>${escaparCliente(a.cliente.telefone)}</span></article>`).join('') || '<p>Nenhuma data próxima da janela de lembrete (23 a 37 dias).</p>';
}
