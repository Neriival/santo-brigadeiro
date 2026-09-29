/* Catálogo público: somente produtos ativos e imagens públicas autorizadas por RLS. */
async function carregarCatalogoOnline() {
    if (typeof supabaseClient === 'undefined') return;
    try {
        const {data: registros, error} = await supabaseClient.from('produtos')
            .select('id,nome,categoria,descricao,preco').eq('ativo',true).order('id');
        if (error) throw error;
        if (!registros?.length) return;
        const ids = registros.map(item => item.id);
        const {data: imagens, error: erroImagens} = await supabaseClient.from('produto_imagens')
            .select('produto_id,caminho,principal,ordem').in('produto_id',ids)
            .order('ordem',{ascending:true});
        if (erroImagens) throw erroImagens;
        const porProduto = new Map();
        for (const foto of imagens || []) {
            const lista = porProduto.get(foto.produto_id) || [];
            lista.push(foto);
            porProduto.set(foto.produto_id, lista);
        }
        for (const item of registros) {
            const fotos = (porProduto.get(item.id) || []).sort((a,b) => Number(b.principal)-Number(a.principal));
            const galeria = fotos.map(foto => supabaseClient.storage.from('produtos-fotos')
                .getPublicUrl(foto.caminho).data.publicUrl);
            // IDs negativos evitam conflito com os produtos fixos existentes.
            produtos.push({
                id: -Number(item.id), origemBanco: true,
                nome: item.nome, categoria: item.categoria,
                descricao: item.descricao || '', preco: Number(item.preco),
                imagem: galeria[0] || '', galeria
            });
        }
    } catch (erro) {
        console.error('Não foi possível carregar o catálogo do Supabase:', erro);
        // Em caso de falha, os produtos fixos continuam disponíveis.
    }
}
