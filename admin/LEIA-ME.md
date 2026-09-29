# Painel da Karina — organização

- `index.html`: estrutura do login, menu, dashboard, pedidos e modal. Os IDs originais foram preservados.
- `css/admin.css`: estilos básicos do painel, formatados para leitura.
- `css/responsive.css`: regras de tablet e celular.
- `css/tema.css`: cores azul-bebê, animações e correção do fundo da logo.
- `js/auth.js`: autenticação e validação de administradores.
- `js/pedidos.js`: busca, filtros e atualização dos pedidos.
- `js/admin.js`: inicialização e eventos da interface.

**Importante:** a ordem dos arquivos CSS no HTML preserva a cascata anterior. Os arquivos JS continuam na ordem original, sem mudanças funcionais. Não foram criadas seções HTML carregadas por `fetch`, para evitar problemas de inicialização do painel.

## Testes manuais
1. Abrir `admin/index.html` via servidor local e conferir login.
2. Conferir dashboard e atualização de pedidos.
3. Abrir detalhes, filtrar e alterar status de um pedido de teste.
4. Verificar responsividade e animações no celular.
