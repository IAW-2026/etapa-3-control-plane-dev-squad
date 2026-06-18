'use client'

import { useState } from 'react'
import { AlertTriangle, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react'
import type { Report } from '../services/feedback-api'

interface Props {
  report: Report
  onResolve: (report: Report) => void
}

export default function ReportCard({ report, onResolve }: Props) {
  const [aiOpinion, setAiOpinion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiExpanded, setAiExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleAIOpinion = async () => {
    if (aiExpanded) {
      setAiExpanded(false)
      return
    }
    setAiLoading(true)
    setAiError('')
    setAiExpanded(true)
    try {
      const res = await fetch(`/api/admin/reports/${report.id}/ai-opinion`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al obtener opinión IA')
      setAiOpinion(data.opinion)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiOpinion)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        report.resuelto
          ? 'border-[var(--border)] opacity-60'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            {!report.resuelto && (
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span className="text-sm font-medium">
              Reportado por {report.reporterName || 'Anónimo'}
            </span>
            <span className="text-[11px] opacity-40">
              {new Date(report.fecha).toLocaleDateString('es-AR')}
            </span>
            {report.resuelto && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border border-[var(--border)] bg-[var(--muted)]">
                Resuelto
              </span>
            )}
          </div>
          <p className="text-sm opacity-70">{report.razon}</p>
          {report.review && (
            <div className="mt-2 p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm space-y-1 hover:bg-[var(--muted-hover)] transition-colors">
              <p className="font-medium">{report.review.userName || 'Anónimo'}</p>
              <p className="opacity-70">{report.review.comentario}</p>
              <p className="opacity-40 text-xs">
                Rating: {'★'.repeat(report.review.rating)}{'☆'.repeat(5 - report.review.rating)}
                {' — '}{report.review.targetName || report.review.targetId}
              </p>
            </div>
          )}
          {report.comentarioAdmin && (
            <p className="text-xs opacity-50 italic">
              Admin: {report.comentarioAdmin}
            </p>
          )}
        </div>
        {!report.resuelto && (
          <div className="shrink-0 flex gap-2">
            <button
              onClick={handleAIOpinion}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                aiExpanded
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading ? 'Analizando...' : aiExpanded ? 'Cerrar IA' : 'Opinión IA'}
            </button>
            <button
              onClick={() => onResolve(report)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Resolver
            </button>
          </div>
        )}
      </div>

      {aiExpanded && (
        <div className="mt-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
          {aiLoading ? (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Analizando reporte con IA...</span>
            </div>
          ) : aiError ? (
            <p className="text-sm text-red-500">{aiError}</p>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{aiOpinion}</p>
              <button
                onClick={handleCopy}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '¡Copiada!' : 'Copiar sugerencia'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
