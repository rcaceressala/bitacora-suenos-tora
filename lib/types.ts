export interface Sueno {
  id: string
  user_id: string
  titulo: string
  descripcion: string
  emociones: string[]
  fecha: string
  interpretacion: string | null
  interpretado_en: string | null
  created_at: string
}

export interface Profile {
  id: string
  nombre: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  lemon_squeezy_id: string | null
  status: 'free' | 'active' | 'cancelled' | 'expired'
  variant_id: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}
