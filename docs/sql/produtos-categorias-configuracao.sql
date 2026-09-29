-- Execute uma vez no SQL Editor do Supabase. Não remove produtos nem pedidos.
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS configuracao jsonb NOT NULL DEFAULT '{}'::jsonb;
-- As políticas RLS existentes continuam valendo. Os dados de configuração
-- são públicos para produtos ativos, assim como seus nomes e preços.
