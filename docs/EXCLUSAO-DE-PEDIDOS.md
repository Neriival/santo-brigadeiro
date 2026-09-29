# Botão Excluir pedido — Santo Brigadeiro

1. Faça backup do projeto e dos pedidos de teste.
2. Substitua apenas `admin/js/pedidos.js`, `admin/js/admin.js` e `admin/css/admin.css`.
3. No Supabase SQL Editor, execute `admin/SQL-exclusao-pedido.sql`.
4. Atualize o painel com Ctrl+F5, entre como Karina e abra os detalhes de UM pedido de teste.
5. Clique em **Excluir este pedido**, digite `EXCLUIR` e confira a lista de pedidos.
6. Se houver erro de chave estrangeira por outras tabelas vinculadas, NÃO desative restrições: identifique a tabela e ajuste a função.

**Segurança:** a autorização acontece dentro da função SQL, verificando `auth.uid()` na tabela `admins`. Não conceda DELETE diretamente ao visitante.
**Atenção:** esta operação exclui permanentemente o pedido e seus itens, sem lixeira.
