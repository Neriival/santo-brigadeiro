/* =========================================================
   PRODUTOS - CADASTRO ADMINISTRATIVO
   Usa a tabela public.produtos e as políticas RLS já criadas.
   Não modifica os produtos fixos do site nesta primeira fase.
========================================================= */
let produtosAdmin = [];
const $produto = id => document.getElementById(id);
function mensagemProdutos(texto) { $produto('produtosMensagem').textContent = texto; }
function moedaProduto(valor) { return Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

async function carregarProdutosAdmin() {
  mensagemProdutos('Carregando produtos...');
  const { data, error } = await supabaseClient.from('produtos').select('id,nome,categoria,descricao,preco,ativo').order('id',{ascending:false});
  if (error) { mensagemProdutos('Erro ao carregar: ' + error.message); return; }
  produtosAdmin = data || [];
  mensagemProdutos(produtosAdmin.length ? `${produtosAdmin.length} produto(s) cadastrado(s) no banco.` : 'Nenhum produto cadastrado no banco ainda.');
  const lista = $produto('listaProdutos'); lista.replaceChildren();
  produtosAdmin.forEach(produto => {
    const card = document.createElement('article'); card.className='produto-card';
    const info = document.createElement('div');
    const titulo = document.createElement('strong'); titulo.textContent=produto.nome;
    const detalhes = document.createElement('p'); detalhes.textContent=`${produto.categoria} · ${moedaProduto(produto.preco)} · ${produto.ativo ? 'Ativo' : 'Inativo'}`;
    info.append(titulo,detalhes);
    const editar=document.createElement('button'); editar.type='button'; editar.className='btn-secondary'; editar.textContent='Editar'; editar.addEventListener('click',()=>abrirProdutoAdmin(produto));
    card.append(info,editar); lista.append(card);
  });
}
function abrirProdutoAdmin(produto=null) {
  $produto('produtoForm').reset(); $produto('produtoErro').textContent='';
  $produto('produtoTitulo').textContent=produto?'Editar produto':'Novo produto';
  $produto('produtoId').value=produto?.id ?? '';
  $produto('produtoNome').value=produto?.nome ?? '';
  $produto('produtoCategoria').value=produto?.categoria ?? 'bolos';
  $produto('produtoDescricao').value=produto?.descricao ?? '';
  $produto('produtoPreco').value=produto?.preco ?? '';
  $produto('produtoAtivo').checked=produto?.ativo ?? true;
  $produto('produtoModal').classList.remove('hidden'); $produto('produtoNome').focus();
}
function configurarProdutosAdmin() {
  $produto('novoProduto').addEventListener('click',()=>abrirProdutoAdmin());
  document.querySelectorAll('[data-fechar-produto]').forEach(el=>el.addEventListener('click',()=> $produto('produtoModal').classList.add('hidden')));
  $produto('produtoForm').addEventListener('submit',async event=>{
    event.preventDefault();
    const botao=$produto('salvarProduto'); botao.disabled=true; $produto('produtoErro').textContent='';
    const id=$produto('produtoId').value;
    const registro={nome:$produto('produtoNome').value.trim(),categoria:$produto('produtoCategoria').value,descricao:$produto('produtoDescricao').value.trim() || null,preco:Number($produto('produtoPreco').value),ativo:$produto('produtoAtivo').checked};
    try {
      if (!registro.nome || !Number.isFinite(registro.preco) || registro.preco<0) throw new Error('Confira nome e preço.');
      const consulta=id ? supabaseClient.from('produtos').update(registro).eq('id',Number(id)).select('id') : supabaseClient.from('produtos').insert(registro).select('id');
      const {data,error}=await consulta;
      if(error) throw error;
      if(!data?.length) throw new Error('Nenhuma alteração confirmada. Verifique as permissões administrativas.');
      $produto('produtoModal').classList.add('hidden'); await carregarProdutosAdmin(); mensagemProdutos('Produto salvo com sucesso!');
    } catch(erro) { $produto('produtoErro').textContent=erro.message || 'Não foi possível salvar.'; }
    finally { botao.disabled=false; }
  });
}
