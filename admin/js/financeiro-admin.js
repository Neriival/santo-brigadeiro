/* Financeiro: registros confirmados pelo banco, não pelo navegador. */
let financeiroCarregando = false;
function configurarFinanceiroAdmin() {
  const mes = document.getElementById('mesFinanceiro');
  const agora = new Date();
  mes.value = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;
  mes.addEventListener('change', carregarFinanceiroAdmin);
  document.getElementById('refreshFinanceiro').addEventListener('click', carregarFinanceiroAdmin);
}
async function carregarFinanceiroAdmin() {
  if (financeiroCarregando) return;
  financeiroCarregando = true;
  const erro = document.getElementById('financeiroErro');
  erro.textContent = '';
  try {
    const linhas = [];
    // Paginação: não limitar o faturamento aos primeiros mil registros do Supabase.
    for (let inicio=0; ; inicio+=1000) {
      const {data,error} = await supabaseClient.from('faturamento_confirmado')
        .select('pedido_id,numero_pedido,total_confirmado,confirmado_em,ativo')
        .order('confirmado_em',{ascending:false}).range(inicio,inicio+999);
      if(error) throw error;
      linhas.push(...(data||[]));
      if(!data || data.length<1000) break;
    }
    const ativos=linhas.filter(x=>x.ativo);
    const mesSelecionado=document.getElementById('mesFinanceiro').value;
    const mesDe=x=>{const partes=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit'}).formatToParts(new Date(x.confirmado_em));const ano=partes.find(p=>p.type==='year').value;const mes=partes.find(p=>p.type==='month').value;return `${ano}-${mes}`;};
    const agrupados=new Map();
    ativos.forEach(x=>{const k=mesDe(x); const a=agrupados.get(k)||{total:0,qtd:0};a.total+=Number(x.total_confirmado)||0;a.qtd++;agrupados.set(k,a)});
    const atual=agrupados.get(mesSelecionado)||{total:0,qtd:0};
    document.getElementById('financeiroTotal').textContent=dinheiro(atual.total);
    document.getElementById('financeiroQuantidade').textContent=String(atual.qtd);
    document.getElementById('financeiroMeses').innerHTML=[...agrupados.entries()].sort((a,b)=>b[0].localeCompare(a[0])).map(([mes,a])=>`<div class="financeiro-mes"><span>${escapar(mes.split('-').reverse().join('/'))}</span><strong>${dinheiro(a.total)}</strong><small>${a.qtd} encomenda(s)</small></div>`).join('')||'<p class="financeiro-vazio">Nenhum pedido confirmado ainda.</p>';
    document.getElementById('financeiroPedidos').innerHTML=ativos.filter(x=>mesDe(x)===mesSelecionado).map(x=>`<div class="financeiro-linha"><div><strong>${escapar(x.numero_pedido||('#'+x.pedido_id))}</strong><small>Confirmado em ${dataHoraBR(x.confirmado_em)}</small></div><strong>${dinheiro(x.total_confirmado)}</strong></div>`).join('')||'<p class="financeiro-vazio">Nenhuma encomenda confirmada neste mês.</p>';
  } catch(e){console.error('Financeiro:',e);erro.textContent='Não foi possível carregar o financeiro. Execute o SQL de faturamento e confira as permissões.';}
  finally{financeiroCarregando=false;}
}
