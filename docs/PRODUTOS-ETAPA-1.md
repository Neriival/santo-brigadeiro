# Cadastro de produtos — etapa 1

O painel agora cadastra, lista e edita registros da tabela `public.produtos`, incluindo a disponibilidade.

**Importante:** o cardápio público ainda usa `js/produtos.js` (catálogo fixo). Os produtos cadastrados no painel **não aparecem automaticamente no site** nesta etapa. Não remova o catálogo fixo antes de implementar a migração e os preços específicos por tamanho/recheio.

A tabela `produtos` e as políticas RLS devem ter sido criadas no Supabase. Faça login no painel como usuário registrado em `admins`. A política de SELECT administrativa deve permitir a visualização de itens inativos.

## Teste
1. Faça login e abra Produtos.
2. Cadastre um produto fictício.
3. Edite seu preço e desative-o.
4. Reabra a lista e confira a alteração.
5. Confira o registro no Table Editor do Supabase.

Nesta etapa não há exclusão, upload de fotos, preços variáveis nem sincronização com o cardápio público. Essas funções serão implementadas separadamente para preservar os pedidos existentes.
