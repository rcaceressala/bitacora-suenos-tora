-- Ejecutar en Supabase SQL Editor

-- Tabla de sueños
CREATE TABLE IF NOT EXISTS suenos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo      TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  emociones   TEXT[] DEFAULT '{}',
  fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
  interpretacion    TEXT,
  interpretado_en   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE suenos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven solo sus sueños"
  ON suenos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para listar por fecha
CREATE INDEX IF NOT EXISTS suenos_user_fecha_idx ON suenos (user_id, fecha DESC);
