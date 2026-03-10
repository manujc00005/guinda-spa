'use client'

import { useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DurationUnit = 'MINUTES' | 'HOURS' | 'SESSIONS'

interface DurationInputProps {
  value: number
  onChange: (value: number) => void
  /** Optional: show a unit selector dropdown */
  showUnitSelector?: boolean
  /** Currently selected unit */
  unit?: DurationUnit
  /** Called when unit changes */
  onUnitChange?: (unit: DurationUnit) => void
  label?: string
  min?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Unit labels
// ---------------------------------------------------------------------------

const unitLabels: Record<DurationUnit, string> = {
  MINUTES: 'min',
  HOURS: 'h',
  SESSIONS: 'ses.',
}

const unitOptions: { value: DurationUnit; label: string }[] = [
  { value: 'MINUTES', label: 'Minutos' },
  { value: 'HOURS', label: 'Horas' },
  { value: 'SESSIONS', label: 'Sesiones' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DurationInput({
  value,
  onChange,
  showUnitSelector = false,
  unit: controlledUnit,
  onUnitChange,
  label = 'Duración',
  min = 0,
  className = '',
}: DurationInputProps) {
  const [internalUnit, setInternalUnit] = useState<DurationUnit>('MINUTES')
  const activeUnit = controlledUnit ?? internalUnit

  const handleValueChange = (raw: string) => {
    const parsed = parseInt(raw, 10)
    onChange(isNaN(parsed) ? 0 : parsed)
  }

  const handleUnitChange = (newUnit: DurationUnit) => {
    if (onUnitChange) {
      onUnitChange(newUnit)
    } else {
      setInternalUnit(newUnit)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-inter)]">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        {/* Number input */}
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            min={min}
            className={[
              'w-full pl-3 pr-12 py-2 rounded-lg border border-gray-300 text-sm',
              'font-[family-name:var(--font-inter)] tabular-nums',
              'focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]',
              'transition-colors',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            ].join(' ')}
          />

          {/* Unit suffix */}
          {!showUnitSelector && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-gray-400 font-[family-name:var(--font-inter)] font-medium">
                {unitLabels[activeUnit]}
              </span>
            </div>
          )}
        </div>

        {/* Unit selector dropdown */}
        {showUnitSelector && (
          <select
            value={activeUnit}
            onChange={(e) => handleUnitChange(e.target.value as DurationUnit)}
            className={[
              'px-3 py-2 rounded-lg border border-gray-300 text-sm',
              'font-[family-name:var(--font-inter)]',
              'focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]',
              'transition-colors bg-white',
            ].join(' ')}
          >
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}
