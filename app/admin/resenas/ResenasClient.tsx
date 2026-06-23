'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageSquare, Calendar } from 'lucide-react'
import SearchInput from '../../../components/SearchInput'
import FilterSelect from '../../../components/FilterSelect'
import Pagination from '../../../components/Pagination'
import ReviewsTable from '../../../components/ReviewsTable'
import EditReviewModal from '../../../components/EditReviewModal'
import type { Review } from '../../../services/feedback-api'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ResenasClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const tipo = searchParams.get('tipo') || ''
  const estado = searchParams.get('estado') || ''
  const rating = searchParams.get('rating') || ''
  const fechaDesde = searchParams.get('fechaDesde') || ''
  const fechaHasta = searchParams.get('fechaHasta') || ''

  const hasClientFilters = search || rating || estado || fechaDesde || fechaHasta

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      query.set('limit', hasClientFilters ? '100' : '10')
      if (!hasClientFilters) query.set('page', String(page))
      if (tipo) query.set('tipo', tipo)
      if (estado) query.set('estado', estado)

      const res = await fetch(`/api/admin/reviews?${query}`)
      const data: PaginatedResponse<Review> & { error?: string } = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al cargar reseñas')

      let filtered = data.data
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.userName?.toLowerCase().includes(q) ||
            r.targetName?.toLowerCase().includes(q)
        )
      }
      if (estado) {
        filtered = filtered.filter((r) => r.estado === estado)
      }
      if (rating) {
        filtered = filtered.filter((r) => r.rating === Number(rating))
      }
      if (fechaDesde) {
        const from = new Date(fechaDesde)
        filtered = filtered.filter((r) => new Date(r.fecha) >= from)
      }
      if (fechaHasta) {
        const until = new Date(fechaHasta)
        until.setHours(23, 59, 59, 999)
        filtered = filtered.filter((r) => new Date(r.fecha) <= until)
      }

      if (hasClientFilters) {
        const start = (page - 1) * 10
        setReviews(filtered.slice(start, start + 10))
        setTotalPages(Math.max(1, Math.ceil(filtered.length / 10)))
        setTotal(filtered.length)
      } else {
        setReviews(data.data)
        setTotalPages(data.totalPages)
        setTotal(data.total)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [page, search, tipo, estado, rating, fechaDesde, fechaHasta, hasClientFilters])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    let resetPage = false
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
      if (k !== 'page') resetPage = true
    })
    if (resetPage) params.set('page', '1')
    router.push(`/admin/resenas?${params}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2">
        <SearchInput
          placeholder="Buscar por usuario o target..."
          value={search}
          onChange={(v) => updateParams({ search: v })}
          className="w-full sm:flex-1 sm:max-w-sm"
        />

        <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:gap-2">
          <FilterSelect
            value={tipo}
            onChange={(v) => updateParams({ tipo: v })}
            options={[
              { value: '', label: 'Tipo' },
              { value: 'product', label: 'Producto' },
              { value: 'seller', label: 'Vendedor' },
            ]}
            className="sm:w-36"
          />
          <FilterSelect
            value={estado}
            onChange={(v) => updateParams({ estado: v })}
            options={[
              { value: '', label: 'Estado' },
              { value: 'published', label: 'Publicado' },
              { value: 'removed', label: 'Eliminado' },
              { value: 'reported', label: 'Reportado' },
            ]}
            className="sm:w-36"
          />
          <FilterSelect
            value={rating}
            onChange={(v) => updateParams({ rating: v })}
            options={[
              { value: '', label: 'Rating' },
              { value: '5', label: '5 estrellas' },
              { value: '4', label: '4 estrellas' },
              { value: '3', label: '3 estrellas' },
              { value: '2', label: '2 estrellas' },
              { value: '1', label: '1 estrella' },
            ]}
            className="sm:w-36"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--muted-hover)] focus-within:ring-2 focus-within:ring-[var(--foreground)] focus-within:ring-opacity-20 transition-colors cursor-pointer w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-[var(--foreground)] opacity-40 shrink-0" />
            <span className="text-xs text-[var(--foreground)] opacity-50 shrink-0">Desde</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => updateParams({ fechaDesde: e.target.value })}
              className="bg-transparent border-none outline-none text-sm cursor-pointer p-0 min-w-0 flex-1"
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--muted-hover)] focus-within:ring-2 focus-within:ring-[var(--foreground)] focus-within:ring-opacity-20 transition-colors cursor-pointer w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-[var(--foreground)] opacity-40 shrink-0" />
            <span className="text-xs text-[var(--foreground)] opacity-50 shrink-0">Hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => updateParams({ fechaHasta: e.target.value })}
              className="bg-transparent border-none outline-none text-sm cursor-pointer p-0 min-w-0 flex-1"
            />
          </div>
        </div>

        <span className="text-xs whitespace-nowrap opacity-50 w-full sm:w-auto">
          {total} reseña{total !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-6 text-center max-w-md">
            <p className="font-medium mb-1">Error al cargar reseñas</p>
            <p className="text-sm opacity-70">{error}</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <MessageSquare className="w-12 h-12 opacity-30 mx-auto mb-3" />
          <p className="font-medium opacity-60">No hay reseñas</p>
        </div>
      ) : (
        <>
          <ReviewsTable reviews={reviews} onEdit={setEditingReview} />
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
        </>
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onSaved={() => {
            setEditingReview(null)
            fetchReviews()
          }}
          onClose={() => setEditingReview(null)}
        />
      )}
    </div>
  )
}
