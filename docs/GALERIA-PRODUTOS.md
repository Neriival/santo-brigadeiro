# Galeria de fotos dos produtos

1. Faça backup do projeto e do banco de dados.
2. Execute **uma vez** `docs/sql/galeria-produtos.sql` no SQL Editor do Supabase.
3. Abra o painel, entre em Produtos, edite um produto existente e envie até 10 fotos JPG, PNG ou WebP (máx. 5 MB por foto).
4. Teste definir foto principal e excluir uma foto de teste.

O bucket `produtos-fotos` é público **apenas para leitura das imagens**. Enviar, editar metadados e remover fotos requer autenticação e associação em `public.admins`. Não armazene fotos de clientes nem imagens privadas nesse bucket.

O site público ainda usa o catálogo fixo de `js/produtos.js`; fotos novas não aparecerão automaticamente nele até a próxima etapa de integração.

Se o SQL falhar porque o bucket já existe com configuração diferente, revise-o antes de prosseguir. Não apague um bucket que já contém fotos.
