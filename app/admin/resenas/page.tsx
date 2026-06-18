import { Suspense } from 'react'
import type { Metadata } from 'next'
import ResenasClient from './ResenasClient'

export const metadata: Metadata = {
  title: 'Reseñas | Super Admin',
  description: 'Gestión de reseñas del marketplace',
}

export default function ResenasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Reseñas</h1>
        <p className="text-sm opacity-60 mt-1">
          Todas las reseñas del marketplace, centralizadas desde Feedback App
        </p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ResenasClient />
      </Suspense>
    </div>
  )
}
