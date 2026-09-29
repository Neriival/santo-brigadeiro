-- Execute após backup, no SQL Editor do Supabase.
-- Faturamento pelo momento da confirmação; histórico financeiro sem dados pessoais.
CREATE TABLE IF NOT EXISTS public.faturamento_confirmado (
  pedido_id bigint PRIMARY KEY,
  numero_pedido text,
  total_confirmado numeric(12,2) NOT NULL CHECK(total_confirmado >= 0),
  confirmado_em timestamptz NOT NULL,
  ativo boolean NOT NULL DEFAULT true
);
ALTER TABLE public.faturamento_confirmado ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins consultam faturamento" ON public.faturamento_confirmado;
CREATE POLICY "Admins consultam faturamento" ON public.faturamento_confirmado FOR SELECT TO authenticated
USING (EXISTS(SELECT 1 FROM public.admins WHERE user_id=(SELECT auth.uid())));
REVOKE ALL ON public.faturamento_confirmado FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.faturamento_confirmado TO authenticated;

CREATE OR REPLACE FUNCTION public.sincronizar_faturamento_confirmado()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  -- Apenas a transição explícita para 'confirmado' gera lançamento.
  IF NEW.status = 'confirmado' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'confirmado') THEN
    IF TG_OP = 'INSERT' OR OLD.status NOT IN ('em_producao','pronto','finalizado') THEN
      INSERT INTO public.faturamento_confirmado(pedido_id,numero_pedido,total_confirmado,confirmado_em,ativo)
      VALUES(NEW.id,NEW.numero_pedido::text,NEW.total,now(),true)
      ON CONFLICT(pedido_id) DO UPDATE SET
        numero_pedido=EXCLUDED.numero_pedido,
        total_confirmado=EXCLUDED.total_confirmado,
        confirmado_em=CASE WHEN faturamento_confirmado.ativo THEN faturamento_confirmado.confirmado_em ELSE EXCLUDED.confirmado_em END,
        ativo=true;
    END IF;
  END IF;
  -- Cancelamento remove dos totais sem apagar a trilha financeira.
  IF NEW.status='cancelado' THEN
    UPDATE public.faturamento_confirmado SET ativo=false WHERE pedido_id=NEW.id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sincronizar_faturamento ON public.pedidos;
CREATE TRIGGER trg_sincronizar_faturamento AFTER INSERT OR UPDATE OF status ON public.pedidos
FOR EACH ROW EXECUTE FUNCTION public.sincronizar_faturamento_confirmado();
REVOKE ALL ON FUNCTION public.sincronizar_faturamento_confirmado() FROM PUBLIC,anon,authenticated;

-- Pedidos já no status 'confirmado': data histórica exata de confirmação não
-- está disponível; use created_at como aproximação, somente para esses pedidos.
INSERT INTO public.faturamento_confirmado(pedido_id,numero_pedido,total_confirmado,confirmado_em,ativo)
SELECT id,numero_pedido::text,total,created_at,true FROM public.pedidos WHERE status='confirmado'
ON CONFLICT(pedido_id) DO NOTHING;
