'use client'

import { useState } from 'react'
import type { LocalizedText } from '@/lib/types/menu'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Locale = 'es' | 'en' | 'fr'

interface LocalizedInputProps {
  value: LocalizedText
  onChange: (value: LocalizedText) => void
  label: string
  /** Whether ES is required (default true) */
  required?: boolean
  placeholder?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Locales config
// ---------------------------------------------------------------------------

const locales: { key: Locale; label: string }[] = [
  { key: 'es', label: 'ES' },
  { key: 'en', label: 'EN' },
  { key: 'fr', label: 'FR' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LocalizedInput({
  value,
  onChange,
  label,
  required = true,
  placeholder,
  className = '',
}: LocalizedInputProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>('es')

  const handleChange = (text: string) => {
    onChange({
      ...value,
      [activeLocale]: text,
    })
  }

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-inter)]">
        {label}
      </label>

      {/* Locale tabs */}
      <div className="flex gap-1 mb-1.5">
        {locales.map((loc) => {
          const isActive = activeLocale === loc.key
          const isRequired = loc.key === 'es' && required
          return (
            <button
              key={loc.key}
              type="button"
              onClick={() => setActiveLocale(loc.key)}
              className={[
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                'font-[family-name:var(--font-inter)]',
                isActive
                  ? 'bg-[#1a1a2e] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
              ].join(' ')}
            >
              {loc.label}
              {isRequired && <span className="text-[#c9a96e] ml-0.5">*</span>}
            </button>
          )
        })}
      </div>

      {/* Input */}
      <input
        type="text"
        value={value[activeLocale] ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        required={activeLocale === 'es' && required}
        placeholder={placeholder ?? `${label} (${activeLocale.toUpperCase()})`}
        className={[
          'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm',
          'font-[family-name:var(--font-inter)]',
          'focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]',
          'placeholder:text-gray-400 transition-colors',
        ].join(' ')}
      />
    </div>
  )
}
