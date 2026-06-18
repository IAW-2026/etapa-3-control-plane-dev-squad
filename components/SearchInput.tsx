'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface Props {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ placeholder, value, onChange }: Props) {
  const [local, setLocal] = useState(value)
  const lastSent = useRef(value)

  useEffect(() => {
    if (value !== lastSent.current) {
      setLocal(value)
      lastSent.current = value
    }
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== lastSent.current) {
        onChange(local)
        lastSent.current = local
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [local, onChange])

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)] opacity-30 pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--muted)] hover:bg-[var(--muted-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-transparent focus:bg-[var(--muted-hover)] placeholder:text-[var(--foreground)] placeholder:opacity-30 transition-colors"
      />
    </div>
  )
}
