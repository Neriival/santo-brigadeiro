# Financeiro da Karina

1. Faça backup do Supabase. Execute `docs/sql/financeiro-confirmados.sql` no SQL Editor **após** `docs/sql/clientes-lembretes-prazo.sql`.
2. Atualize o painel e entre em **Financeiro**. Confirme um pedido de teste, verifique o valor e cancele para conferir que o valor deixa de ser somado.
3. Os lançamentos são feitos pelo banco ao passar para o status `confirmado`. Ao avançar para produção/pronto/finalizado, continuam no faturamento. Ao cancelar, ficam registrados como inativos e saem dos totais. Ao excluir um pedido, o lançamento financeiro sem dados pessoais permanece; cancele antes de excluir se não quiser contabilizá-lo.
4. Pedidos que já estavam no status `confirmado` antes da instalação entram com `created_at` como data **aproximada** da confirmação; outros status anteriores não são importados, pois não há prova de quando foram confirmados.
5. Faturamento representa encomendas confirmadas, não recebimentos, lucro, custos ou fluxo de caixa. O total é o valor no momento da confirmação, mesmo que o pedido seja editado posteriormente.
