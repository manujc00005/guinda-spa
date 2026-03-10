'use client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PriceInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  step?: number
  min?: number
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PriceInput({
  value,
  onChange,
  label = 'Precio',
  step = 0.01,
  min = 0,
  className = '',
}: PriceInputProps) {
  const handleChange = (raw: string) => {
    const parsed = parseFloat(raw)
    onChange(isNaN(parsed) ? 0 : parsed)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-inter)]">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          step={step}
          min={min}
          className={[
            'w-full pl-3 pr-12 py-2 rounded-lg border border-gray-300 text-sm',
            'font-[family-name:var(--font-inter)] tabular-nums',
            'focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]',
            'transition-colors',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          ].join(' ')}
        />

        {/* EUR suffix */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-gray-400 font-[family-name:var(--font-inter)] font-medium">
            EUR
          </span>
        </div>
      </div>
    </div>
  )
}
