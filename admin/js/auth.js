/* Login, sessão e autorização administrativa | Santo Brigadeiro */

const loginScreen = document.getElementById('loginScreen');
const adminApp = document.getElementById('adminApp');

async function obterAdminDaSessao() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabaseClient.from('admins').select('user_id,nome').eq('user_id', session.user.id).maybeSingle();
  if (error || !data) {
    await supabaseClient.auth.signOut();
    return null;
  }
  return { session, admin: data };
}

async function entrarComoAdmin(email, senha) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error('E-mail ou senha inválidos.');
  const { data: admin, error: adminError } = await supabaseClient.from('admins').select('user_id,nome').eq('user_id', data.user.id).maybeSingle();
  if (adminError || !admin) {
    await supabaseClient.auth.signOut();
    throw new Error('Este usuário não possui acesso administrativo.');
  }
  return admin;
}

async function sairDoPainel() { await supabaseClient.auth.signOut(); window.location.reload(); }
