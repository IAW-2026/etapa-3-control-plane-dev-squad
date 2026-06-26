'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Flag, Calendar } from 'lucide-react'
import SearchInput from '../../../components/SearchInput'
import FilterSelect from '../../../components/FilterSelect'
import Pagination from '../../../components/Pagination'
import ReportCard from '../../../components/ReportCard'
import ResolveModal from '../../../components/ResolveModal'
import type { Report } from '../../../services/feedback-api'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ReportesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const resolvedFilter = searchParams.get('resolved') || ''
  const rating = searchParams.get('rating') || ''
  const fechaDesde = searchParams.get('fechaDesde') || ''
  const fechaHasta = searchParams.get('fechaHasta') || ''

  const hasClientFilters = rating || fechaDesde || fechaHasta

  const [resolveModal, setResolveModal] = useState<{
    open: boolean
    report: Report | null
    action: 'dismiss' | 'remove'
    comment: string
    loading: boolean
  }>({ open: false, report: null, action: 'dismiss', comment: '', loading: false })

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      query.set('limit', hasClientFilters ? '100' : '10')
      if (!hasClientFilters) query.set('page', String(page))
      if (search) query.set('search', search)
      if (resolvedFilter) query.set('resolved', resolvedFilter)

      const res = await fetch(`/api/admin/reports?${query}`)
      const data: PaginatedResponse<Report> & { error?: string } = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al cargar reportes')

      let filtered = data.data
      if (rating) {
        filtered = filtered.filter(
          (r) => r.review && r.review.rating === Number(rating)
        )
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
        setReports(filtered.slice(start, start + 10))
        setTotalPages(Math.max(1, Math.ceil(filtered.length / 10)))
        setTotal(filtered.length)
      } else {
        setReports(data.data)
        setTotalPages(data.totalPages)
        setTotal(data.total)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [page, search, resolvedFilter, rating, fechaDesde, fechaHasta, hasClientFilters])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    let resetPage = false
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
      if (k !== 'page') resetPage = true
    })
    if (resetPage) params.set('page', '1')
    router.push(`/admin/reportes?${params}`)
  }

  async function handleResolve() {
    if (!resolveModal.report) return
    setResolveModal((prev) => ({ ...prev, loading: true }))
    try {
      const res = await fetch(`/api/admin/reports/${resolveModal.report.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: resolveModal.action,
          adminId: 'control-plane-admin',
          comentarioAdmin: resolveModal.comment || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al resolver')
      setResolveModal({ open: false, report: null, action: 'dismiss', comment: '', loading: false })
      fetchReports()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al resolver reporte')
      setResolveModal((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2">
        <SearchInput
          placeholder="Buscar por motivo, usuario o reseña..."
          value={search}
          onChange={(v) => updateParams({ search: v })}
          className="w-full sm:flex-1 sm:max-w-sm"
        />

        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:gap-2">
          <FilterSelect
            value={resolvedFilter}
            onChange={(v) => updateParams({ resolved: v })}
            options={[
              { value: '', label: 'Estado' },
              { value: 'false', label: 'Pendientes' },
              { value: 'true', label: 'Resueltos' },
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
          {total} reporte{total !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-6 text-center max-w-md">
            <p className="font-medium mb-1">Error al cargar reportes</p>
            <p className="text-sm opacity-70">{error}</p>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <Flag className="w-12 h-12 opacity-30 mx-auto mb-3" />
          <p className="font-medium opacity-60">No hay reportes</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onResolve={(r) =>
                  setResolveModal({ open: true, report: r, action: 'dismiss', comment: '', loading: false })
                }
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
        </>
      )}

      {resolveModal.open && resolveModal.report && (
        <ResolveModal
          action={resolveModal.action}
          comment={resolveModal.comment}
          loading={resolveModal.loading}
          onChangeAction={(a) => setResolveModal((prev) => ({ ...prev, action: a }))}
          onChangeComment={(c) => setResolveModal((prev) => ({ ...prev, comment: c }))}
          onConfirm={handleResolve}
          onClose={() => setResolveModal((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  )
}
