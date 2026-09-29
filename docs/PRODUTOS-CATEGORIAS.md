# Produtos por categoria — atualização

Execute `docs/sql/produtos-categorias-configuracao.sql` no Supabase antes de abrir a tela atualizada.

A tela agora tem botões compactos por categoria e formulários específicos. Novos produtos salvam seus detalhes em `produtos.configuracao`. A galeria e os produtos já existentes no banco são preservados.

**Importante:** os produtos originais definidos em `js/produtos.js` aparecem na categoria correspondente, identificados como *Cardápio original*. Eles continuam funcionando como antes, mas ainda não são editáveis pelo painel; migrá-los automaticamente sem alterar os modais de cálculo geraria duplicatas e risco de preço incorreto. A próxima etapa é migrar cada configuração e conectar os formulários aos cálculos do cardápio público. Os novos campos de configuração ainda não alteram automaticamente os modais de encomenda.
