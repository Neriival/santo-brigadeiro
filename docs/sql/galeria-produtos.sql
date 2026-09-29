-- Santo Brigadeiro: galeria de fotos dos produtos (execute manualmente no Supabase).
-- Requer public.produtos e public.admins(user_id). Não altera pedidos ou dados existentes.
CREATE TABLE IF NOT EXISTS public.produto_imagens (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produto_id bigint NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  caminho text NOT NULL UNIQUE,
  principal boolean NOT NULL DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT caminho_produto CHECK (caminho ~ ('^' || produto_id::text || '/[a-f0-9-]+[.](jpg|png|webp)$'))
);
CREATE INDEX IF NOT EXISTS idx_produto_imagens_produto ON public.produto_imagens(produto_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_produto_imagens_principal
  ON public.produto_imagens(produto_id) WHERE principal;
ALTER TABLE public.produto_imagens ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.produto_imagens TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.produto_imagens TO authenticated;

DROP POLICY IF EXISTS "Galeria publica de produtos ativos" ON public.produto_imagens;
CREATE POLICY "Galeria publica de produtos ativos" ON public.produto_imagens
FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.produtos p WHERE p.id=produto_id AND p.ativo=true)
);
DROP POLICY IF EXISTS "Admins consultam todas as fotos" ON public.produto_imagens;
CREATE POLICY "Admins consultam todas as fotos" ON public.produto_imagens
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
);
DROP POLICY IF EXISTS "Admins inserem fotos" ON public.produto_imagens;
CREATE POLICY "Admins inserem fotos" ON public.produto_imagens
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
);
DROP POLICY IF EXISTS "Admins atualizam fotos" ON public.produto_imagens;
CREATE POLICY "Admins atualizam fotos" ON public.produto_imagens
FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
);
DROP POLICY IF EXISTS "Admins excluem fotos" ON public.produto_imagens;
CREATE POLICY "Admins excluem fotos" ON public.produto_imagens
FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
);

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES ('produtos-fotos','produtos-fotos',true,5242880,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins enviam fotos dos produtos" ON storage.objects;
CREATE POLICY "Admins enviam fotos dos produtos" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id='produtos-fotos'
  AND EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
  AND EXISTS (SELECT 1 FROM public.produtos p WHERE p.id = CASE
    WHEN (storage.foldername(name))[1] ~ '^[0-9]{1,15}$' THEN ((storage.foldername(name))[1])::bigint
    ELSE NULL END)
);
DROP POLICY IF EXISTS "Admins consultam arquivos de produtos" ON storage.objects;
CREATE POLICY "Admins consultam arquivos de produtos" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id='produtos-fotos'
  AND EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
);
DROP POLICY IF EXISTS "Admins removem fotos dos produtos" ON storage.objects;
CREATE POLICY "Admins removem fotos dos produtos" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id='produtos-fotos'
  AND EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id=(SELECT auth.uid()))
);

-- Atualiza a foto principal de forma atômica e somente para administradores.
CREATE OR REPLACE FUNCTION public.definir_foto_principal(p_produto_id bigint,p_imagem_id bigint)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id=auth.uid()
  ) THEN RAISE EXCEPTION 'Acesso administrativo necessário' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM public.produtos WHERE id=p_produto_id FOR UPDATE;
  IF NOT EXISTS (SELECT 1 FROM public.produto_imagens
    WHERE id=p_imagem_id AND produto_id=p_produto_id) THEN
    RAISE EXCEPTION 'Imagem não encontrada neste produto';
  END IF;
  UPDATE public.produto_imagens SET principal=false
    WHERE produto_id=p_produto_id AND principal=true;
  UPDATE public.produto_imagens SET principal=true
    WHERE produto_id=p_produto_id AND id=p_imagem_id;
END;
$$;
REVOKE ALL ON FUNCTION public.definir_foto_principal(bigint,bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.definir_foto_principal(bigint,bigint) FROM anon;
GRANT EXECUTE ON FUNCTION public.definir_foto_principal(bigint,bigint) TO authenticated;
