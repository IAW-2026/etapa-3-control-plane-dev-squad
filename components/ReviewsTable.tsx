'use client'

import type { Review } from '../services/feedback-api'
import StarRating from './StarRating'

interface Props {
  reviews: Review[]
}

export default function ReviewsTable({ reviews }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Usuario</th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Target</th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Tipo</th>
            <th className="text-center text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Rating</th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Comentario</th>
            <th className="text-right text-xs font-semibold uppercase tracking-wider px-5 py-3 opacity-60">Fecha</th>
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
              <td className="px-5 py-4 text-right text-sm opacity-50">
                {new Date(review.fecha).toLocaleDateString('es-AR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
