/* Inicialização do painel, navegação e eventos | Santo Brigadeiro */

document.addEventListener('DOMContentLoaded', iniciarPainel);

async function iniciarPainel() {
  configurarEventos();
  try {
    const acesso = await obterAdminDaSessao();
    if (acesso) await mostrarPainel(acesso.admin);
  } catch (e) { console.error(e); }
}

function configurarEventos() {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault(); const msg = document.getElementById('loginMessage'); const btn = document.getElementById('loginButton');
    msg.textContent = ''; btn.disabled = true; btn.textContent = 'Entrando...';
    try { const admin = await entrarComoAdmin(document.getElementById('email').value.trim(), document.getElementById('senha').value); await mostrarPainel(admin); }
    catch (err) { msg.textContent = err.message || 'Não foi possível entrar.'; }
    finally { btn.disabled = false; btn.textContent = 'Entrar'; }
  });
  document.getElementById('logoutButton').addEventListener('click', sairDoPainel);
  document.getElementById('refreshButton').addEventListener('click', carregarPedidos);
  document.getElementById('searchInput').addEventListener('input', filtrarPedidos);
  document.getElementById('statusFilter').addEventListener('change', filtrarPedidos);
  configurarProdutosAdmin();
  configurarClientesAdmin();
  configurarFinanceiroAdmin();
  document.getElementById('menuButton').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
  document.addEventListener('click', async e => {
    const nav = e.target.closest('[data-view]'); if (nav) trocarView(nav.dataset.view);
    if (e.target.closest('[data-go-pedidos]')) trocarView('pedidos');
    const open = e.target.closest('[data-open-order]'); if (open) { try { await abrirPedido(open.dataset.openOrder); } catch(err) { console.error(err); alert('Não foi possível abrir os detalhes do pedido.'); } }
    if (e.target.closest('[data-close-modal]')) document.getElementById('orderModal').classList.add('hidden');
    const excluir = e.target.closest('#deleteOrder'); if (excluir) { try { await excluirPedidoAdmin(excluir.dataset.id); } catch(err) { console.error(err); } }
    const save = e.target.closest('#saveStatus'); if (save) { save.disabled = true; try { await atualizarStatus(save.dataset.id, document.getElementById('modalStatus').value); } catch(err) { console.error(err); } finally { save.disabled = false; } }
  });
}

async function mostrarPainel(admin) {
  loginScreen.classList.add('hidden'); adminApp.classList.remove('hidden');
  document.getElementById('adminName').textContent = admin.nome || 'Admin'; document.getElementById('welcomeName').textContent = admin.nome || 'Admin';
  carregarClientesAdmin();
  carregarFinanceiroAdmin();
  try { await carregarPedidos(); } catch (e) { console.error(e); document.getElementById('recentOrders').innerHTML = '<div class="empty-state"><strong>Erro ao carregar</strong><p>Confira as permissões do Supabase.</p></div>'; }
}

function trocarView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  document.getElementById(`${view}View`).classList.add('active-view'); document.getElementById('pageTitle').textContent = ({dashboard:'Dashboard',pedidos:'Pedidos',produtos:'Produtos',clientes:'Clientes e lembretes',financeiro:'Financeiro'})[view] || 'Dashboard'; if (view === 'produtos') carregarProdutosAdmin(); if (view === 'clientes') carregarClientesAdmin(); if (view === 'financeiro') carregarFinanceiroAdmin();
  document.getElementById('sidebar').classList.remove('open');
}
