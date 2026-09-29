-- Santo Brigadeiro: exclusão de pedido com autorização no servidor.
-- Execute no SQL Editor do projeto correto; faça backup dos testes antes.
-- A função usa os nomes de tabelas identificados no painel atual.
CREATE OR REPLACE FUNCTION public.excluir_pedido_admin(p_pedido_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acesso administrativo necessário' USING ERRCODE = '42501';
  END IF;

  -- Bloqueia o pedido enquanto a exclusão é processada.
  PERFORM 1 FROM public.pedidos WHERE id = p_pedido_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pedido não encontrado';
  END IF;

  DELETE FROM public.itens_pedido WHERE pedido_id = p_pedido_id;
  DELETE FROM public.pedidos WHERE id = p_pedido_id;
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.excluir_pedido_admin(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.excluir_pedido_admin(bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.excluir_pedido_admin(bigint) TO authenticated;
