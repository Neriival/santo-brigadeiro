# Santo Brigadeiro — organização do projeto

- `index.html`, `css/`, `js/` e `sections/`: site do cliente, carrinho e finalização.
- `admin/`: painel da Karina (login, dashboard, pedidos e exclusão).
- `assets/`: imagens utilizadas pelo site e pelo painel.
- `docs/sql/`: SQL de instalação e manutenção; **não é executado automaticamente**.

## Limpeza realizada
- Removida a pasta `.git` somente da cópia de distribuição: não deve ser substituída no projeto local, pois contém o histórico Git.
- Documentação da exclusão e SQL movidos para `docs/`.
- Adicionado `.gitignore` para evitar inclusão acidental de credenciais e arquivos locais.
- Os arquivos HTML, CSS e JavaScript usados pelo site não foram removidos nem tiveram lógica alterada.

## Próxima fase: catálogo gerenciável
O cardápio está atualmente em `js/produtos.js`. Antes de editar produtos pelo painel e publicar alterações automaticamente, criar tabelas de produtos/configurações e políticas RLS no Supabase, migrar o catálogo existente e atualizar o carregamento no site. Não apagar `js/produtos.js` antes de testar essa migração.
