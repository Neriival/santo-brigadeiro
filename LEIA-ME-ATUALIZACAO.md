# Atualização: catálogo por categoria e correção do Financeiro

1. Faça backup da pasta atual e do Supabase. Extraia este ZIP sobre o projeto,
   preservando sua pasta `.git` (não incluída neste arquivo).
2. Execute no SQL Editor do Supabase **apenas** o novo arquivo
   `docs/sql/financeiro-correcao-status-exclusao.sql`. Os outros scripts já
   executados não precisam ser repetidos.
3. Atualize o painel com Ctrl+F5. Em Produtos, filtre por categoria, pesquise
   e use + Novo produto para cadastrar itens simples com fotos.
4. Teste: confirme um pedido de teste, confira o Financeiro; volte para Novo,
   confira que saiu do total; confirme novamente e exclua o pedido, verificando
   que saiu do total. Selecione o mês da confirmação para conferir.

Atenção: produtos novos ainda são de preço fixo. Bolos com tamanhos/recheios
personalizados continuam com configuração no código antigo. Não misture
produtos de teste com encomendas reais no faturamento.
