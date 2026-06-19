'use client'
// app/admin/payments/disputas/DisputasClient.tsx
import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_PAYMENTS_API_URL ?? ''
const API_KEY  = process.env.NEXT_PUBLIC_PAYMENTS_API_KEY  ?? ''

interface Disputa {
  id:      string
  pagoId:  string
  userId:  string
  motivo:  string
  estado:  'ABIERTA' | 'RESUELTA' | 'PERDIDA'
  fecha:   string
  monto:   number
  ordenId: string
}

const BADGE: Record<string, { bg: string; text: string; label: string }> = {
  ABIERTA:  { bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-600 dark:text-red-400',    label: 'Abierta'  },
  RESUELTA: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Resuelta' },
  PERDIDA:  { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Perdida'  },
}

export default function DisputasClient() {
  const [data, setData]       = useState<Disputa[]>([])
  const [loading, setLoading] = useState(true)

  function cargar() {
    fetch(`${API_BASE}/api/admin/stats`, {
      headers: { 'x-internal-api-key': API_KEY },
    })
      .then(r => r.json())
      .then(d => { setData(d.disputas ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  async function cambiarEstado(id: string, estado: string) {
    await fetch(`${API_BASE}/api/disputes/${id}`, {
      method:  'PATCH',
      headers: {
        'Content-Type':       'application/json',
        'x-internal-api-key': API_KEY,
      },
      body: JSON.stringify({ estado }),
    })
    cargar()
  }

  const abiertas  = data.filter(d => d.estado === 'ABIERTA').length
  const resueltas = data.filter(d => d.estado === 'RESUELTA').length
  const perdidas  = data.filter(d => d.estado === 'PERDIDA').length

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pagos — Disputas</h1>
        <p className="text-sm opacity-60 mt-1">Pagos en disputa que requieren revisión.</p>
      </div>

      {/* Badges resumen */}
      <div className="flex gap-2 flex-wrap">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${BADGE.ABIERTA.bg} ${BADGE.ABIERTA.text}`}>
          {abiertas} abierta{abiertas !== 1 ? 's' : ''}
        </span>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${BADGE.RESUELTA.bg} ${BADGE.RESUELTA.text}`}>
          {resueltas} resuelta{resueltas !== 1 ? 's' : ''}
        </span>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${BADGE.PERDIDA.bg} ${BADGE.PERDIDA.text}`}>
          {perdidas} perdida{perdidas !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm opacity-40 border border-border rounded-xl bg-background">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-sm opacity-40 border border-border rounded-xl bg-background">No hay disputas registradas.</div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: '680px' }}>
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider hidden sm:table-cell">Orden</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider hidden md:table-cell">Usuario</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">Monto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">Motivo</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold opacity-50 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={d.id} className={`border-t border-border ${i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}`}>
                    <td className="px-4 py-3 font-mono text-xs opacity-60">{d.id.slice(0, 6)}…</td>
                    <td className="px-4 py-3 font-mono text-xs opacity-60 hidden sm:table-cell">{d.ordenId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-xs opacity-60 hidden md:table-cell">{d.userId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-xs font-semibold text-right text-red-500">
                      $ {d.monto.toLocaleString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[200px] truncate">{d.motivo}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={d.estado}
                        onChange={e => cambiarEstado(d.id, e.target.value)}
                        className="text-xs rounded-lg border border-border bg-background px-2 py-1 font-semibold cursor-pointer focus:outline-none"
                      >
                        <option value="ABIERTA">Abierta</option>
                        <option value="RESUELTA">Resuelta</option>
                        <option value="PERDIDA">Perdida</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}