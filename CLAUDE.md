# Santo Brigadeiro

Cardápio online da confeitaria da Karina (bolos, docinhos, salgados, kits e topos).
A cliente monta o pedido no celular, o pedido é salvo no Supabase e enviado pelo
WhatsApp. A Karina acompanha pedidos, clientes, financeiro e produtos pelo painel
em `admin/`.

## Como trabalhar neste projeto

- **Sempre em português do Brasil**: respostas, comentários no código, nomes de
  funções e variáveis (seguir o padrão que já existe: `abrirProduto`, `carrinho`...).
- **Explicações didáticas**: o dono do projeto está aprendendo. Ao mudar algo,
  explique o *porquê* em linguagem simples, sem jargão desnecessário.
- **HTML, CSS e JavaScript puro.** Sem framework, sem build, sem npm, sem bundler.
  Bibliotecas externas só por CDN e **com versão fixa** (ex.:
  `@supabase/supabase-js@2.45.4`, nunca `@2` ou `@latest`).
- Pensar **primeiro no celular** (a maioria das clientes usa o site pelo WhatsApp).
- Antes de mexer, conferir se o PC está igual ao GitHub (`git fetch` + `git status`).

## Segurança — regras que não podem ser quebradas

- **Nunca colocar chaves secretas no código.** No front-end só pode existir a
  chave **publishable** (`sb_publishable_...`) do Supabase. A chave
  `service_role` / `sb_secret_...` e a senha do banco NUNCA entram em arquivo
  nenhum do projeto nem no chat.
- Quem protege os dados é o **RLS** (Row Level Security) do Supabase, não o
  JavaScript. Toda tabela nova precisa de RLS ligado e regras explícitas.
- Dados de clientes (nome, telefone, endereço) só podem ser lidos por admin logado
  (usuário cadastrado na tabela `admins`).
- Texto vindo do banco que vai para `innerHTML` deve ser escapado
  (no painel existe a função `escapar`, em `admin/js/pedidos.js`).

## Estrutura

```
index.html                 cardápio público (carrega os pedaços de sections/)
sections/*.html            pedaços de HTML carregados por js/components.js
css/                       um arquivo por parte da tela
js/produtos.js             produtos FIXOS e suas opções (tamanhos, recheios, linhas, kits)
js/catalogo-online.js      soma ao cardápio os produtos ativos cadastrados no painel
js/supabase-config.js      URL + chave publishable do Supabase
js/supabase-pedidos.js     grava o pedido (rpc criar_pedido)
js/modal-*.js              montagem de cada tipo de produto
admin/                     painel: pedidos, clientes/lembretes, financeiro, produtos
docs/*.md                  guias de cada etapa
docs/sql/*.sql             scripts rodados MANUALMENTE no SQL Editor do Supabase
```

## Produtos: fixos x cadastrados no painel

- **Fixos** (`js/produtos.js`): Bolo Confeitado, Docinhos, Salgados, Kit Festa,
  Kit Mesversário e Topos. Têm os cálculos de tamanhos, linhas e sabores.
- **Cadastrados no painel** (tabela `produtos` + fotos em `produto_imagens`,
  bucket `produtos-fotos`): entram no site com **id negativo** (para não colidir
  com os fixos) e são de **preço fixo**, mesmo na categoria bolos ou doces.
- Tornar tamanhos/recheios editáveis pelo painel é uma etapa futura
  (já existe a coluna `produtos.configuracao jsonb` para isso).

## Supabase

- Projeto: `santo-brigadeiro` (plano grátis: no máximo 2 projetos ativos;
  projetos sem uso são pausados).
- Tabelas conhecidas: `pedidos`, `itens_pedido`, `admins`, `produtos`,
  `produto_imagens` e as de clientes/lembretes e financeiro (ver `docs/sql/`).
- O SQL que criou `pedidos`, `itens_pedido`, `admins`, `produtos` e a função
  `criar_pedido` **não está no projeto**. Documentar quando o banco for conferido.

## Testar localmente

`components.js` usa `fetch`, então abrir o `index.html` direto (file://) não
funciona. Use um servidor simples, por exemplo a extensão **Live Server** do
VS Code, ou `python -m http.server 5500` na pasta do projeto.
