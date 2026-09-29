# Clientes, lembretes e prazo de encomendas

1. Faça backup do Supabase e da pasta local.
2. Execute `docs/sql/clientes-lembretes-prazo.sql` no SQL Editor (projeto correto).
3. Abra o painel e clique em **Clientes e lembretes**. A primeira carga importa os pedidos antigos que ainda existem na tabela.
4. Faça um pedido de teste com data de depois de amanhã e confira a nova área.
5. O calendário impede hoje/amanhã; o trigger do banco reforça a regra em horário de Brasília.

## Alertas
O painel mostra aniversários de encomendas anteriores que ocorrerão em 23–37 dias, quando aberto/atualizado. Não há envio automático, push ou agendamento em segundo plano. Os dados persistem após excluir pedidos, pois o histórico é separado.

## Privacidade
Nomes, telefones e datas são dados pessoais. Informe os clientes da finalidade de guardar o histórico, restrinja acesso aos administradores e respeite pedidos de exclusão. Para mensagens promocionais futuras, obtenha autorização adequada. Excluir pedido não apaga automaticamente o histórico do cliente.

## Observações
A tabela de histórico usa telefone normalizado como identificador. Pedidos de pessoas diferentes com o mesmo número serão agrupados. O alerta representa a data da encomenda anterior, não necessariamente aniversário pessoal. O banco usa America/Sao_Paulo; para outro fuso, ajuste a função de validação.
