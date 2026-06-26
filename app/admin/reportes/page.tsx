import { Suspense } from 'react'
import type { Metadata } from 'next'
import ReportesClient from './ReportesClient'

export const metadata: Metadata = {
  title: 'Reportes | Super Admin',
  description: 'Moderación de reportes sobre reseñas',
}

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold hidden md:block">Reportes</h1>
        <p className="text-sm opacity-60 mt-1">
          Reportes de reseñas realizados por usuarios — moderación y resolución
        </p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ReportesClient />
      </Suspense>
    </div>
  )
}
