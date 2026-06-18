'use client'

import { X, ThumbsUp, Trash2, XCircle, Check } from 'lucide-react'

interface Props {
  action: 'dismiss' | 'remove'
  comment: string
  loading: boolean
  onChangeAction: (action: 'dismiss' | 'remove') => void
  onChangeComment: (comment: string) => void
  onConfirm: () => void
  onClose: () => void
}

const MAX_COMMENT = 500

export default function ResolveModal({
  action,
  comment,
  loading,
  onChangeAction,
  onChangeComment,
  onConfirm,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 w-full max-w-md mx-4 shadow-2xl" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Resolver reporte</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--muted)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Acción</label>
            <div className="flex gap-3">
              <button
                onClick={() => onChangeAction('dismiss')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  action === 'dismiss'
                    ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'border-[var(--border)] hover:bg-[var(--muted)]'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Desestimar
              </button>
              <button
                onClick={() => onChangeAction('remove')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  action === 'remove'
                    ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                    : 'border-[var(--border)] hover:bg-[var(--muted)]'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
            <p className="text-xs opacity-50 mt-1">
              {action === 'dismiss'
                ? 'El reporte se marca como resuelto, la reseña queda publicada.'
                : 'La reseña se eliminará del sistema permanentemente.'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Comentario <span className="opacity-50 font-normal">({comment.length}/{MAX_COMMENT})</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT) onChangeComment(e.target.value)
              }}
              placeholder="Agregá un comentario sobre la resolución..."
              rows={3}
              maxLength={MAX_COMMENT}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:bg-[var(--muted)] resize-none transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--background)] cursor-pointer hover:opacity-90 ${
                action === 'remove' ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--foreground)] hover:opacity-90'
              } disabled:opacity-50`}
            >
              <Check className="w-4 h-4" />
              {loading ? 'Resolviendo...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
