-- Santo Brigadeiro | Histórico de clientes e datas de encomendas
-- Execute no SQL Editor do Supabase uma vez, depois de fazer backup.
-- Dados pessoais: apenas administradores autenticados podem consultar.

CREATE TABLE IF NOT EXISTS public.clientes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  telefone text NOT NULL UNIQUE,
  nome text NOT NULL,
  primeiro_pedido_em date NOT NULL,
  ultimo_pedido_em date NOT NULL,
  total_pedidos integer NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS public.datas_clientes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id bigint NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  pedido_id bigint UNIQUE, -- sem FK: histórico permanece após exclusão do pedido
  data_original date NOT NULL,
  descricao text NOT NULL DEFAULT 'Encomenda',
  numero_pedido text
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datas_clientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins leem clientes" ON public.clientes;
CREATE POLICY "Admins leem clientes" ON public.clientes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Admins leem datas" ON public.datas_clientes;
CREATE POLICY "Admins leem datas" ON public.datas_clientes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = (SELECT auth.uid())));
REVOKE ALL ON public.clientes FROM anon, authenticated;
REVOKE ALL ON public.datas_clientes FROM anon, authenticated;
GRANT SELECT ON public.clientes, public.datas_clientes TO authenticated;

CREATE OR REPLACE FUNCTION public.registrar_historico_encomenda()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_cliente_id bigint;
BEGIN
  IF NEW.telefone IS NULL OR btrim(NEW.telefone) = '' OR NEW.data_encomenda IS NULL THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.clientes(telefone,nome,primeiro_pedido_em,ultimo_pedido_em,total_pedidos)
  VALUES (regexp_replace(NEW.telefone,'[^0-9]','','g'),NEW.nome_cliente,NEW.data_encomenda,NEW.data_encomenda,1)
  ON CONFLICT(telefone) DO UPDATE SET
    nome = EXCLUDED.nome,
    primeiro_pedido_em = LEAST(clientes.primeiro_pedido_em, EXCLUDED.primeiro_pedido_em),
    ultimo_pedido_em = GREATEST(clientes.ultimo_pedido_em, EXCLUDED.ultimo_pedido_em),
    total_pedidos = clientes.total_pedidos + 1
  RETURNING id INTO v_cliente_id;
  INSERT INTO public.datas_clientes(cliente_id,pedido_id,data_original,numero_pedido)
  VALUES (v_cliente_id,NEW.id,NEW.data_encomenda,NEW.numero_pedido::text)
  ON CONFLICT(pedido_id) DO NOTHING;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_historico_encomenda ON public.pedidos;
CREATE TRIGGER trg_historico_encomenda AFTER INSERT ON public.pedidos
FOR EACH ROW EXECUTE FUNCTION public.registrar_historico_encomenda();
REVOKE ALL ON FUNCTION public.registrar_historico_encomenda() FROM PUBLIC, anon, authenticated;

-- Importa pedidos já existentes sem duplicar datas; preserve este histórico.
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT * FROM public.pedidos WHERE telefone IS NOT NULL AND btrim(telefone) <> '' AND data_encomenda IS NOT NULL ORDER BY created_at LOOP
    IF NOT EXISTS (SELECT 1 FROM public.datas_clientes WHERE pedido_id = r.id) THEN
      INSERT INTO public.clientes(telefone,nome,primeiro_pedido_em,ultimo_pedido_em,total_pedidos)
      VALUES (regexp_replace(r.telefone,'[^0-9]','','g'),r.nome_cliente,r.data_encomenda,r.data_encomenda,1)
      ON CONFLICT(telefone) DO UPDATE SET
        nome=EXCLUDED.nome,
        primeiro_pedido_em=LEAST(clientes.primeiro_pedido_em,EXCLUDED.primeiro_pedido_em),
        ultimo_pedido_em=GREATEST(clientes.ultimo_pedido_em,EXCLUDED.ultimo_pedido_em),
        total_pedidos=clientes.total_pedidos+1;
      INSERT INTO public.datas_clientes(cliente_id,pedido_id,data_original,numero_pedido)
      SELECT id,r.id,r.data_encomenda,r.numero_pedido::text FROM public.clientes
      WHERE telefone=regexp_replace(r.telefone,'[^0-9]','','g')
      ON CONFLICT(pedido_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- Bloqueia pedidos para hoje ou amanhã, mesmo se burlarem o calendário.
CREATE OR REPLACE FUNCTION public.validar_antecedencia_encomenda()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.data_encomenda IS NULL OR
     NEW.data_encomenda < (timezone('America/Sao_Paulo',now())::date + 2) THEN
    RAISE EXCEPTION 'Encomendas exigem no mínimo 2 dias de antecedência' USING ERRCODE='22023';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_validar_antecedencia ON public.pedidos;
CREATE TRIGGER trg_validar_antecedencia BEFORE INSERT ON public.pedidos
FOR EACH ROW EXECUTE FUNCTION public.validar_antecedencia_encomenda();
REVOKE ALL ON FUNCTION public.validar_antecedencia_encomenda() FROM PUBLIC, anon, authenticated;
