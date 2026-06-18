'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('...')

  for (let i = start; i <= end; i++) pages.push(i)

  if (end < total - 1) pages.push('...')

  if (total > 1) pages.push(total)

  return pages
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--muted)] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Anterior
      </button>

      <div className="flex items-center gap-1 mx-1">
        {getPageNumbers(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm opacity-40 select-none">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] px-2 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer ${
                p === page
                  ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] font-medium'
                  : 'border-[var(--border)] hover:bg-[var(--muted)]'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--muted)] transition-colors cursor-pointer"
      >
        Siguiente
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
