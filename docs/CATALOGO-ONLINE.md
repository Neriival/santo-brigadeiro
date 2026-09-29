# Catálogo público e fotos

A listagem administrativa exibe a foto principal dos produtos cadastrados no Supabase.
O site público carrega produtos **ativos** da tabela `public.produtos` e suas imagens de `public.produto_imagens`, exibindo a principal no cartão e setas na galeria do modal. A leitura utiliza apenas a chave pública e as políticas RLS existentes.

## Atenção à configuração dos produtos

Os produtos fixos existentes em `js/produtos.js` continuam disponíveis, incluindo seus cálculos de bolos, doces, salgados e kits. Os produtos novos cadastrados no painel aparecem **como itens de preço fixo e quantidade simples**, mesmo se estiverem na categoria bolos ou doces. Para ter tamanhos, massas, recheios, descontos ou regras por cento configuráveis no painel, será necessária uma próxima etapa.

Não cadastre um produto no painel esperando que ele herde automaticamente as opções do produto fixo de nome parecido. Até migrarmos o catálogo, produtos fixos e cadastrados podem aparecer lado a lado.

## Teste

1. Abra o painel > Produtos e confirme a miniatura do produto com foto principal.
2. Abra o site público, selecione a categoria do produto e confirme que ele aparece com a imagem.
3. Adicione uma segunda foto no painel e confira as setas no modal público.
4. Desative o produto no painel, atualize o site público e confirme que ele desapareceu.
5. Teste um pedido simples de um produto cadastrado no painel e um pedido com produto fixo para confirmar que os fluxos continuam funcionando.

Nenhum SQL novo é necessário além do script `docs/sql/galeria-produtos.sql` já executado.

## Lista administrativa

Em **Produtos**, use o filtro de categoria e a busca por nome/descrição.
O botão **+ Novo produto** já cadastra itens de preço fixo e permite fotos.
Tamanhos e recheios personalizados continuam sendo uma etapa futura.
