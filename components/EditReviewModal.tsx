'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Star, Check, XCircle, ChevronDown } from 'lucide-react'
import type { Review } from '../services/feedback-api'

interface Props {
  review: Review
  onSaved: () => void
  onClose: () => void
}

const MAX_COMENTARIO = 200
const MIN_COMENTARIO = 10

const estadoOptions = [
  { value: 'published', label: 'Publicado' },
  { value: 'reported', label: 'Reportado' },
  { value: 'removed', label: 'Eliminado' },
]

export default function EditReviewModal({ review, onSaved, onClose }: Props) {
  const [rating, setRating] = useState(review.rating)
  const [comentario, setComentario] = useState(review.comentario)
  const [estado, setEstado] = useState(review.estado || 'published')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estadoOpen, setEstadoOpen] = useState(false)
  const [estadoMenuStyle, setEstadoMenuStyle] = useState<React.CSSProperties>({})
  const estadoRef = useRef<HTMLDivElement>(null)

  const closeEstado = useCallback(() => setEstadoOpen(false), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (estadoRef.current && !estadoRef.current.contains(e.target as Node)) {
        setEstadoOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleEstado(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setEstadoMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    })
    setEstadoOpen((prev) => !prev)
  }

  const canSave = comentario.trim().length >= MIN_COMENTARIO && !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      const body: Record<string, unknown> = { rating, comentario }
      if (estado !== review.estado) body.estado = estado

      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar')
      }
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  const selectedEstado = estadoOptions.find((o) => o.value === estado)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 sm:p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Editar reseña</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--muted)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium block mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    star <= rating ? 'text-amber-400' : 'opacity-30 hover:opacity-50'
                  }`}
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
              <span className="text-sm opacity-50 ml-2">({rating}/5)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Comentario</label>
              <span className={`text-xs ${
                comentario.length > MAX_COMENTARIO
                  ? 'text-red-500'
                  : comentario.length < MIN_COMENTARIO && comentario.length > 0
                    ? 'text-amber-500'
                    : 'opacity-50'
              }`}>
                {comentario.length}/{MAX_COMENTARIO}
              </span>
            </div>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value.slice(0, MAX_COMENTARIO))}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:bg-[var(--muted)] resize-none transition-colors"
            />
            {comentario.length > 0 && comentario.length < MIN_COMENTARIO && (
              <p className="text-xs text-amber-500 mt-1">Mínimo {MIN_COMENTARIO} caracteres</p>
            )}
          </div>

          <div ref={estadoRef}>
            <label className="text-sm font-medium block mb-2">Estado</label>
            <button
              type="button"
              onClick={toggleEstado}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--muted)] hover:bg-[var(--muted-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-transparent cursor-pointer transition-colors"
            >
              <span className="flex-1 text-left opacity-80">{selectedEstado?.label}</span>
              <ChevronDown
                className={`w-4 h-4 opacity-40 transition-transform duration-200 ${
                  estadoOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {estadoOpen && (
              <div
                className="fixed z-[60] rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg overflow-hidden"
                style={estadoMenuStyle}
              >
                {estadoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setEstado(opt.value)
                      closeEstado()
                    }}
                    className={`w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors ${
                      opt.value === estado
                        ? 'bg-[var(--muted)] font-medium'
                        : 'hover:bg-[var(--muted)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--background)] bg-[var(--foreground)] hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
