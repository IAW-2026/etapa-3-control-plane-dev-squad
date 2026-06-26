'use client'

import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: Option[]
  className?: string
}

export default function FilterSelect({ value, onChange, options, className }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className={`relative w-auto sm:w-36 ${className ?? ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 pl-8 pr-8 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--muted)] hover:bg-[var(--muted-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-opacity-20 focus:border-transparent cursor-pointer transition-colors relative"
      >
        <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)] opacity-40 pointer-events-none" />
        <span className="opacity-80">{selected?.label ?? options[0]?.label ?? ''}</span>
        <ChevronDown
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors ${
                opt.value === value
                  ? 'bg-[var(--muted)] font-medium'
                  : 'hover:bg-[var(--muted)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
