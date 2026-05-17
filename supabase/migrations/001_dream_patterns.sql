-- Tabla de patrones de símbolos recurrentes en sueños
CREATE TABLE IF NOT EXISTS dream_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  last_seen DATE NOT NULL,
  UNIQUE(user_id, symbol)
);

ALTER TABLE dream_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus patrones"
  ON dream_patterns FOR ALL
  USING (auth.uid() = user_id);

-- Función para upsert de patrones (incrementa count o inserta)
CREATE OR REPLACE FUNCTION upsert_dream_pattern(
  p_user_id UUID,
  p_symbol TEXT,
  p_date DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO dream_patterns (user_id, symbol, count, last_seen)
  VALUES (p_user_id, p_symbol, 1, p_date)
  ON CONFLICT (user_id, symbol)
  DO UPDATE SET
    count = dream_patterns.count + 1,
    last_seen = EXCLUDED.last_seen;
END;
$$;
