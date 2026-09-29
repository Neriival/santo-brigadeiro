# Organização — Santo Brigadeiro

- `index.html`, `css/`, `js/`, `sections/`: cardápio público, carrinho e finalização.
- `admin/index.html`, `admin/css/`, `admin/js/`: painel da Karina, pedidos, clientes, financeiro e produtos.
- `assets/`: logo e imagens locais em uso.
- `docs/`: guias de instalação; `docs/sql/`: scripts executados **manualmente** no Supabase.
- `.gitignore`: arquivos locais e credenciais que não devem ser publicados.

## Limpeza nesta versão
- O ZIP de distribuição não inclui `.git`; **não substitua nem apague** sua pasta `.git` local.
- Eliminadas cópias idênticas do SQL de exclusão e do respectivo guia dentro de `admin/`; versões oficiais em `docs/`.
- Preservados os arquivos CSS/JS e imagens usados pelo site e painel.
- Nova galeria em `admin/js/produtos-admin.js`, `admin/css/produtos.css` e `docs/sql/galeria-produtos.sql`.

## Atenção
A galeria desta etapa gerencia fotos dos produtos cadastrados no Supabase **dentro do painel**.
O catálogo público ainda utiliza `js/produtos.js`; a migração para produtos gerenciados será uma etapa separada.
