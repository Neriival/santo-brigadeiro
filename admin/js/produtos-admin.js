/* =========================================================
   PRODUTOS - CADASTRO ADMINISTRATIVO
   Usa a tabela public.produtos e as políticas RLS já criadas.
   Fotos principais também aparecem na listagem administrativa.
========================================================= */
let produtosAdmin = [];
let categoriaAtiva = 'bolos';
const nomesCategorias = {bolos:'Bolos',doces:'Doces',salgados:'Salgados',kits:'Kits',topos:'Topos',outros:'Outros'};
const detalhesCategoria = {
  bolos:'Bolos, tamanhos, massas e recheios comuns e premium.',
  doces:'Docinhos, linhas, sabores e quantidades.',
  salgados:'Salgados, sabores, quantidades e tipos de preparo.',
  kits:'Kits com bolo, doces, salgados e preço do conjunto.',
  topos:'Topos personalizados e preços.',outros:'Outros itens do cardápio.'
};
const camposCategoria = {
  bolos:[['massas','Massas disponíveis (uma por linha)','textarea'],['recheiosComuns','Recheios comuns (um por linha)','textarea'],['recheiosPremium','Recheios premium (um por linha)','textarea'],['tamanhos','Tamanhos e preços: nome|comum|premium (uma linha por tamanho)','textarea']],
  doces:[['sabores','Sabores (um por linha)','textarea'],['linha','Linha (Comum, Gourmet, Premium...)','text'],['quantidadeMinima','Quantidade mínima','number'],['precoCento','Preço por cento (R$)','number']],
  salgados:[['sabores','Sabores (um por linha)','textarea'],['tipoPreparo','Tipo de preparo (Frito, Assado...)','text'],['quantidadeMinima','Quantidade mínima','number'],['precoCento','Preço por cento (R$)','number']],
  kits:[['conteudo','Itens e quantidades do kit (um por linha)','textarea'],['serve','Serve aproximadamente quantas pessoas?','number']],
  topos:[['tipo','Tipo de topo','text']],outros:[]
};
function preencherCamposEspecificos(config={}) {
  const categoria=$produto('produtoCategoria').value;
  const area=$produto('produtoCamposEspecificos'); area.replaceChildren();
  for(const [chave,rotulo,tipo] of camposCategoria[categoria] || []) {
    const label=document.createElement('label'); label.textContent=rotulo;
    const input=document.createElement(tipo==='textarea'?'textarea':'input');
    input.dataset.campo=chave; if(tipo==='textarea') input.rows=3;
    else {input.type=tipo;if(tipo==='number'){input.min='0';input.step='any';}}
    const valor=config[chave]; input.value=Array.isArray(valor)?valor.map(v=>typeof v==='string'?v:`${v.nome}|${v.precoComum}|${v.precoPremium}`).join('\n'):(valor??'');
    label.append(input);area.append(label);
  }
}
function coletarCamposEspecificos() {
  const config={};
  $produto('produtoCamposEspecificos').querySelectorAll('[data-campo]').forEach(input=>{
    const chave=input.dataset.campo, valor=input.value.trim();
    if(chave==='tamanhos'){
      config[chave]=valor.split('\n').filter(Boolean).map(linha=>{const [nome,comum,premium]=linha.split('|').map(x=>x.trim());if(!nome||!comum||!premium||![comum,premium].every(x=>Number.isFinite(Number(x))&&Number(x)>=0))throw new Error('Use nome|comum|premium em cada tamanho.');return {nome,precoComum:Number(comum),precoPremium:Number(premium)};});
    }else if(['massas','recheiosComuns','recheiosPremium','sabores','conteudo'].includes(chave))config[chave]=valor.split('\n').map(x=>x.trim()).filter(Boolean);
    else if(input.type==='number')config[chave]=valor===''?null:Number(valor);
    else config[chave]=valor;
  });
  return config;
}
function atualizarCategoria(categoria) {
  categoriaAtiva=categoria;
  document.querySelectorAll('[data-categoria]').forEach(b=>{const ativa=b.dataset.categoria===categoria;b.classList.toggle('ativa',ativa);b.setAttribute('aria-pressed',String(ativa));});
  $produto('tituloCategoria').textContent=nomesCategorias[categoria];
  $produto('ajudaCategoria').textContent=detalhesCategoria[categoria];
  $produto('novoProduto').textContent=`+ Cadastrar ${categoria==='bolos'?'bolo':categoria==='doces'?'doce':categoria==='salgados'?'salgado':categoria==='kits'?'kit':categoria==='topos'?'topo':'produto'}`;
  carregarProdutosAdmin();
}

const $produto = id => document.getElementById(id);
function mensagemProdutos(texto) { $produto('produtosMensagem').textContent = texto; }
function moedaProduto(valor) { return Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

async function carregarProdutosAdmin() {
  mensagemProdutos('Carregando produtos...');
  const { data, error } = await supabaseClient.from('produtos').select('id,nome,categoria,descricao,preco,ativo,configuracao').order('id',{ascending:false});
  if (error) { mensagemProdutos('Erro ao carregar: ' + error.message); return; }
  produtosAdmin = data || [];
  mensagemProdutos(produtosAdmin.length ? `${produtosAdmin.length} produto(s) cadastrado(s) no banco.` : 'Nenhum produto cadastrado no banco ainda.');
  const lista = $produto('listaProdutos'); lista.replaceChildren();
  // A foto principal é carregada em lote, sem uma consulta por produto.
  const ids = produtosAdmin.map(item => item.id);
  let fotosPrincipais = new Map();
  if (ids.length) {
    const {data: fotos, error: erroFotos} = await supabaseClient.from('produto_imagens')
      .select('produto_id,caminho').in('produto_id', ids).eq('principal', true);
    if (erroFotos) console.warn('Não foi possível carregar miniaturas:', erroFotos.message);
    else fotosPrincipais = new Map((fotos || []).map(foto => [foto.produto_id, foto.caminho]));
  }
  const filtrados=produtosAdmin.filter(produto=>produto.categoria===categoriaAtiva);
  const legados=(typeof produtos!=='undefined'?produtos:[]).filter(item=>item.categoria===categoriaAtiva);
  mensagemProdutos(`${filtrados.length} cadastrado(s) no painel · ${legados.length} item(ns) do cardápio original.`);
  if(!filtrados.length&&!legados.length){const vazio=document.createElement('p');vazio.textContent='Nenhum produto nesta categoria. Clique em cadastrar para começar.';lista.append(vazio);}
  for(const legado of legados){
    const card=document.createElement('article');card.className='produto-card produto-legado';
    const img=document.createElement('span');img.className='produto-card-sem-foto';img.textContent='📷';
    const info=document.createElement('div');info.className='produto-card-info';
    const nome=document.createElement('strong');nome.textContent=legado.nome;
    const detalhe=document.createElement('p');detalhe.textContent=`A partir de ${moedaProduto(legado.preco)} · Cardápio original`;
    const aviso=document.createElement('small');aviso.textContent='Configuração atual preservada no código; migração para edição pelo painel pendente.';
    info.append(nome,detalhe,aviso);card.append(img,info);lista.append(card);
  }
  filtrados.forEach(produto => {
    const card = document.createElement('article'); card.className='produto-card';
    const caminhoFoto = fotosPrincipais.get(produto.id);
    if (caminhoFoto) {
      const imagem = document.createElement('img');
      imagem.className = 'produto-card-miniatura';
      imagem.src = supabaseClient.storage.from('produtos-fotos').getPublicUrl(caminhoFoto).data.publicUrl;
      imagem.alt = `Foto principal de ${produto.nome}`;
      imagem.loading = 'lazy';
      card.append(imagem);
    } else {
      const semFoto = document.createElement('span');
      semFoto.className = 'produto-card-sem-foto';
      semFoto.textContent = '📷';
      semFoto.setAttribute('aria-label', 'Sem foto');
      card.append(semFoto);
    }
    const info = document.createElement('div');
    info.className = 'produto-card-info';
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
  $produto('produtoCategoria').value=produto?.categoria ?? categoriaAtiva;
  preencherCamposEspecificos(produto?.configuracao || {});
  $produto('produtoDescricao').value=produto?.descricao ?? '';
  $produto('produtoPreco').value=produto?.preco ?? '';
  $produto('produtoAtivo').checked=produto?.ativo ?? true;
  $produto('produtoGaleria').classList.toggle('hidden', !produto?.id);
  $produto('produtoFotos').value = '';
  $produto('produtoFotosMensagem').textContent = '';
  $produto('produtoFotosLista').replaceChildren();
  if (produto?.id) carregarFotosProduto(produto.id);
  $produto('produtoModal').classList.remove('hidden'); $produto('produtoNome').focus();
}
function configurarProdutosAdmin() {
  $produto('novoProduto').addEventListener('click',()=>abrirProdutoAdmin());
  document.querySelectorAll('[data-categoria]').forEach(botao=>botao.addEventListener('click',()=>atualizarCategoria(botao.dataset.categoria)));
  $produto('produtoCategoria').addEventListener('change',()=>preencherCamposEspecificos());
  $produto('produtoFotos').addEventListener('change', enviarFotosProduto);
  document.querySelectorAll('[data-fechar-produto]').forEach(el=>el.addEventListener('click',()=> $produto('produtoModal').classList.add('hidden')));
  $produto('produtoForm').addEventListener('submit',async event=>{
    event.preventDefault();
    const botao=$produto('salvarProduto'); botao.disabled=true; $produto('produtoErro').textContent='';
    const id=$produto('produtoId').value;
    const registro={nome:$produto('produtoNome').value.trim(),categoria:$produto('produtoCategoria').value,descricao:$produto('produtoDescricao').value.trim() || null,preco:Number($produto('produtoPreco').value),ativo:$produto('produtoAtivo').checked,configuracao:coletarCamposEspecificos()};
    try {
      if (!registro.nome || !Number.isFinite(registro.preco) || registro.preco<0) throw new Error('Confira nome e preço.');
      const consulta=id ? supabaseClient.from('produtos').update(registro).eq('id',Number(id)).select('id') : supabaseClient.from('produtos').insert(registro).select('id');
      const {data,error}=await consulta;
      if(error) throw error;
      if(!data?.length) throw new Error('Nenhuma alteração confirmada. Verifique as permissões administrativas.');
      categoriaAtiva=registro.categoria;
      await carregarProdutosAdmin();
      const salvo = produtosAdmin.find(p => p.id === data[0].id);
      if (salvo) abrirProdutoAdmin(salvo);
      mensagemProdutos('Produto salvo com sucesso! Agora você pode adicionar fotos.');
    } catch(erro) { $produto('produtoErro').textContent=erro.message || 'Não foi possível salvar.'; }
    finally { botao.disabled=false; }
  });
}


/* Galeria: bucket público somente para leitura; alterações protegidas por RLS no Supabase. */
const BUCKET_PRODUTOS = 'produtos-fotos';
const MIME_FOTOS = new Set(['image/jpeg','image/png','image/webp']);
let fotosProduto = [];
let carregandoFotos = false;
function avisoFotos(mensagem) { $produto('produtoFotosMensagem').textContent = mensagem; }

async function carregarFotosProduto(produtoId) {
  const {data,error} = await supabaseClient.from('produto_imagens')
    .select('id,produto_id,caminho,principal,ordem').eq('produto_id',produtoId)
    .order('principal',{ascending:false}).order('ordem',{ascending:true}).order('id',{ascending:true});
  if (Number($produto('produtoId').value) !== Number(produtoId)) return;
  if(error) { avisoFotos('Não foi possível carregar as fotos: ' + error.message); return; }
  fotosProduto = data || [];
  const lista = $produto('produtoFotosLista'); lista.replaceChildren();
  for (const foto of fotosProduto) {
    const item=document.createElement('div'); item.className='produto-foto';
    const img=document.createElement('img');
    img.src=supabaseClient.storage.from(BUCKET_PRODUTOS).getPublicUrl(foto.caminho).data.publicUrl;
    img.alt='Foto do produto'; img.loading='lazy';
    item.append(img);
    if(foto.principal){ const selo=document.createElement('span'); selo.className='foto-principal'; selo.textContent='★ Foto principal'; item.append(selo); }
    else { const botao=document.createElement('button'); botao.type='button'; botao.textContent='Definir como principal'; botao.addEventListener('click',()=>definirFotoPrincipal(foto)); item.append(botao); }
    const excluir=document.createElement('button'); excluir.type='button'; excluir.textContent='Excluir foto'; excluir.addEventListener('click',()=>excluirFotoProduto(foto)); item.append(excluir);
    lista.append(item);
  }
  if (!fotosProduto.length) avisoFotos('Nenhuma foto cadastrada.');
  else avisoFotos(`${fotosProduto.length} foto(s) cadastrada(s).`);
}

async function enviarFotosProduto(event) {
  const id=Number($produto('produtoId').value), arquivos=[...event.target.files];
  if(!id || !arquivos.length) return;
  if(carregandoFotos) return;
  if(fotosProduto.length+arquivos.length>10) { avisoFotos('Limite de 10 fotos por produto.'); event.target.value=''; return; }
  for(const arquivo of arquivos) {
    if(!MIME_FOTOS.has(arquivo.type) || arquivo.size>5*1024*1024 || !arquivo.size) {
      avisoFotos('Use apenas JPG, PNG ou WebP com até 5 MB.'); event.target.value=''; return;
    }
  }
  carregandoFotos=true; event.target.disabled=true;
  try {
    for(const arquivo of arquivos) {
      avisoFotos(`Enviando ${arquivo.name}...`);
      const extensao=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[arquivo.type];
      const caminho=`${id}/${crypto.randomUUID()}.${extensao}`;
      const upload=await supabaseClient.storage.from(BUCKET_PRODUTOS).upload(caminho,arquivo,{contentType:arquivo.type,upsert:false});
      if(upload.error) throw upload.error;
      const gravar=await supabaseClient.from('produto_imagens').insert({produto_id:id,caminho,principal:fotosProduto.length===0,ordem:fotosProduto.length}).select('id');
      if(gravar.error) {
        await supabaseClient.storage.from(BUCKET_PRODUTOS).remove([caminho]);
        throw gravar.error;
      }
      fotosProduto.push({id:gravar.data[0].id,produto_id:id,caminho,principal:fotosProduto.length===0});
    }
    await carregarFotosProduto(id);
  } catch(erro) { avisoFotos('Erro no envio: '+(erro.message||'Tente novamente.')); await carregarFotosProduto(id); }
  finally { carregandoFotos=false; event.target.disabled=false; event.target.value=''; }
}

async function definirFotoPrincipal(foto) {
  const id=Number($produto('produtoId').value);
  if(!id || !fotosProduto.some(f=>f.id===foto.id)) return;
  avisoFotos('Atualizando foto principal...');
  // A função RPC executa as duas atualizações numa transação, com verificação de admin.
  const {error}=await supabaseClient.rpc('definir_foto_principal',{p_produto_id:id,p_imagem_id:foto.id});
  if(error) avisoFotos('Não foi possível alterar: '+error.message);
  else await carregarFotosProduto(id);
}

async function excluirFotoProduto(foto) {
  const id=Number($produto('produtoId').value);
  if(!id || !fotosProduto.some(f=>f.id===foto.id) || !confirm('Excluir esta foto permanentemente?')) return;
  // Remove o arquivo primeiro; se falhar, preserva o registro da galeria.
  const removida=await supabaseClient.storage.from(BUCKET_PRODUTOS).remove([foto.caminho]);
  if(removida.error) { avisoFotos('Não foi possível remover a imagem: '+removida.error.message); return; }
  const {error}=await supabaseClient.from('produto_imagens').delete().eq('id',foto.id).eq('produto_id',id);
  if(error) { avisoFotos('Arquivo removido, mas o registro não pôde ser excluído: '+error.message); return; }
  if(foto.principal) {
    const restante=fotosProduto.find(f=>f.id!==foto.id);
    if(restante) await definirFotoPrincipal(restante);
  }
  await carregarFotosProduto(id);
}
