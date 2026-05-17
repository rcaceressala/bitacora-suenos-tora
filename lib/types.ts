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
