-- Tabla de suscripciones Lemon Squeezy
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lemon_squeezy_id    TEXT UNIQUE,
  status              TEXT NOT NULL DEFAULT 'free',
  variant_id          TEXT,
  current_period_end  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propia suscripcion"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Solo el service role puede escribir (webhooks)
CREATE POLICY "Service role gestiona suscripciones"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);
