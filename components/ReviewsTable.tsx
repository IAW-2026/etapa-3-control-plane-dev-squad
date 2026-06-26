'use client'

import { Pencil } from 'lucide-react'
import type { Review } from '../services/feedback-api'
import StarRating from './StarRating'

interface Props {
  reviews: Review[]
  onEdit?: (review: Review) => void
}

const estadoBadge: Record<string, string> = {
  published: 'border-green-500/30 text-green-500 bg-green-500/10',
  removed: 'border-red-500/30 text-red-500 bg-red-500/10',
  reported: 'border-gray-500/30 text-gray-500 bg-gray-500/10',
}

export default function ReviewsTable({ reviews, onEdit }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Usuario</th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Target</th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Tipo</th>
            <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Rating</th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Comentario</th>
            <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Estado</th>
            <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Fecha</th>
            {onEdit && <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60 w-20">Acción</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-[var(--muted)] transition-colors">
              <td className="px-5 py-4 text-sm">{review.userName || 'Anónimo'}</td>
              <td className="px-5 py-4 text-sm font-medium">{review.targetName || review.targetId}</td>
              <td className="px-5 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                  review.tipo === 'product'
                    ? 'border-blue-500/30 text-blue-500 bg-blue-500/10'
                    : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                }`}>
                  {review.tipo === 'product' ? 'Producto' : 'Vendedor'}
                </span>
              </td>
              <td className="px-5 py-4 text-center">
                <StarRating rating={review.rating} />
              </td>
              <td className="px-5 py-4 text-sm opacity-70 max-w-xs truncate">{review.comentario}</td>
              <td className="px-5 py-4 text-center">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${estadoBadge[review.estado] || 'border-gray-500/30 text-gray-500 bg-gray-500/10'}`}>
                  {review.estado || '—'}
                </span>
              </td>
              <td className="px-5 py-4 text-right text-sm opacity-50">
                {new Date(review.fecha).toLocaleDateString('es-AR')}
              </td>
              {onEdit && (
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => onEdit(review)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--muted)] transition-colors cursor-pointer"
                    title="Editar reseña"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
