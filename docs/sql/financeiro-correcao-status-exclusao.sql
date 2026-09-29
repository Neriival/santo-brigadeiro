-- Santo Brigadeiro | Correção do faturamento (2026-09-29)
-- Execute APÓS docs/sql/financeiro-confirmados.sql, com backup do banco.
-- Não apaga o histórico: apenas marca como inativos os lançamentos retirados.
BEGIN;
CREATE OR REPLACE FUNCTION public.sincronizar_faturamento_confirmado()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.faturamento_confirmado SET ativo = false WHERE pedido_id = OLD.id;
    RETURN OLD;
  END IF;

  IF NEW.status = 'confirmado'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'confirmado') THEN
    INSERT INTO public.faturamento_confirmado
      (pedido_id, numero_pedido, total_confirmado, confirmado_em, ativo)
    VALUES (NEW.id, NEW.numero_pedido::text, NEW.total, now(), true)
    ON CONFLICT (pedido_id) DO UPDATE SET
      numero_pedido = EXCLUDED.numero_pedido,
      total_confirmado = EXCLUDED.total_confirmado,
      confirmado_em = CASE
        WHEN public.faturamento_confirmado.ativo
          THEN public.faturamento_confirmado.confirmado_em
        ELSE EXCLUDED.confirmado_em END,
      ativo = true;
  ELSIF NEW.status IN ('novo', 'cancelado') THEN
    UPDATE public.faturamento_confirmado SET ativo = false WHERE pedido_id = NEW.id;
  END IF;
  -- Em produção, pronto e finalizado conservam o lançamento já confirmado.
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sincronizar_faturamento ON public.pedidos;
CREATE TRIGGER trg_sincronizar_faturamento
AFTER INSERT OR UPDATE OF status OR DELETE ON public.pedidos
FOR EACH ROW EXECUTE FUNCTION public.sincronizar_faturamento_confirmado();
REVOKE ALL ON FUNCTION public.sincronizar_faturamento_confirmado() FROM PUBLIC, anon, authenticated;

-- Reconciliar lançamentos antigos: novos/cancelados e pedidos excluídos.
-- Pedidos em produção/prontos/finalizados preservam seu histórico confirmado.
UPDATE public.faturamento_confirmado AS f
SET ativo = false
WHERE f.ativo = true AND NOT EXISTS (
  SELECT 1 FROM public.pedidos AS p
  WHERE p.id = f.pedido_id
    AND p.status IN ('confirmado','em_producao','pronto','finalizado')
);
COMMIT;

-- Conferência opcional após executar:
-- SELECT p.status, f.ativo, count(*)
-- FROM public.faturamento_confirmado f LEFT JOIN public.pedidos p ON p.id=f.pedido_id
-- GROUP BY p.status, f.ativo ORDER BY p.status, f.ativo;
