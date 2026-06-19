'use client'
// app/admin/payments/transferencias/TransferenciasClient.tsx
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_PAYMENTS_API_URL ?? ''
const API_KEY  = process.env.NEXT_PUBLIC_PAYMENTS_API_KEY  ?? ''

type Estado = 'APROBADO' | 'PENDIENTE' | 'RECHAZADO'
type Tab    = 'TODOS' | Estado

interface Transferencia {
  id:        string
  ordenId:   string
  userId:    string
  monto:     number
  estado:    Estado
  createdAt: string
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'TODOS',     label: 'Todos'      },
  { id: 'APROBADO',  label: 'Exitosas'   },
  { id: 'PENDIENTE', label: 'Pendientes' },
  { id: 'RECHAZADO', label: 'Rechazadas' },
]

const ESTADO_BADGE: Record<Estado, { bg: string; text: string; label: string }> = {
  APROBADO:  { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Exitosa'   },
  PENDIENTE: { bg: 'bg-gray-100 dark:bg-gray-800',      text: 'text-gray-500',                      label: 'Pendiente' },
  RECHAZADO: { bg: 'bg-red-100 dark:bg-red-900/30',     text: 'text-red-600 dark:text-red-400',     label: 'Rechazada' },
}

export default function TransferenciasClient() {
  const [data, setData]           = useState<Transferencia[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<Tab>('TODOS')
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [q, setQ]                 = useState('')
  const [qInput, setQInput]       = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('perPage', '10')
    if (tab !== 'TODOS') params.set('estado', tab)
    if (q) params.set('q', q)

    fetch(`${API_BASE}/api/admin/transferencias?${params}`, {
      headers: { 'x-internal-api-key': API_KEY },
    })
      .then(r => r.json())
      .then(d => { setData(d.items ?? []); setTotalPages(d.totalPages ?? 1) })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [tab, page, q])

  const montoTotal = data
    .filter(t => t.estado === 'APROBADO')
    .reduce((s, t) => s + t.monto, 0)

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagos — Transferencias</h1>
        <p className="text-sm opacity-60 mt-1">Historial de pagos procesados en el módulo de pagos.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border border-border bg-background w-fit overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          placeholder="Buscar por pago, orden o usuario"
          value={qInput}
          onChange={e => setQInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { setQ(qInput); setPage(1) } }}
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 w-72"
        />
        <button
          onClick={() => { setQ(qInput); setPage(1) }}
          className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium"
        >
          Buscar
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-6 p-4 rounded-xl border border-border bg-background w-fit text-sm">
        <div>
          <p className="text-xs opacity-50">Transacciones</p>
          <p className="text-lg font-bold mt-0.5">{data.length}</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-xs opacity-50">Monto total (exitosas)</p>
          <p className="text-lg font-bold mt-0.5">$ {montoTotal.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="p-12 text-center text-sm opacity-40 border border-border rounded-xl bg-background">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-sm opacity-40 border border-border rounded-xl bg-background">No hay transferencias.</div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">ID Pago</th>
                <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider hidden sm:table-cell">Orden</th>
                <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider hidden md:table-cell">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">Fecha</th>
                <th className="text-right px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">Monto</th>
                <th className="text-center px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => {
                const badge = ESTADO_BADGE[t.estado]
                return (
                  <tr key={t.id} className={`border-t border-border ${i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}`}>
                    <td className="px-4 py-3 font-mono text-xs opacity-60">{t.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 font-mono text-xs opacity-60 hidden sm:table-cell">{t.ordenId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-xs opacity-60 hidden md:table-cell">{t.userId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-xs opacity-60">
                      {new Date(t.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-right">
                      $ {t.monto.toLocaleString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs opacity-50">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}