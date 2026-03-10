'use client'

import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import AdminButton from '../ui/AdminButton'

const PIN_LENGTH = 6

export default function LoginForm() {
  const router = useRouter()
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const pin = digits.join('')

  function handleChange(index: number, value: string) {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError('')

    // Auto-advance to next input
    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH)
    if (pasted.length > 0) {
      const next = Array(PIN_LENGTH).fill('')
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i]
      }
      setDigits(next)
      inputRefs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus()
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (pin.length !== PIN_LENGTH) {
      setError('Introduce el código completo')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const json = await res.json()

      if (json.success) {
        router.push('/admin')
      } else {
        setError(json.error || 'Código incorrecto')
        setDigits(Array(PIN_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Error de conexión. Inténtalo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#c9a96e] font-[family-name:var(--font-playfair)] tracking-wide">
            Guinda
          </h1>
          <p className="mt-1 text-sm text-gray-400 font-[family-name:var(--font-inter)]">
            Panel de Administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2 text-center font-[family-name:var(--font-playfair)]">
            Código de acceso
          </h2>
          <p className="text-xs text-gray-400 text-center mb-6 font-[family-name:var(--font-inter)]">
            Introduce el PIN de 6 dígitos
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN inputs */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className={[
                    'w-11 h-13 text-center text-xl font-semibold rounded-lg border',
                    'font-[family-name:var(--font-inter)]',
                    'focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]',
                    'transition-colors',
                    error ? 'border-red-300 bg-red-50/50' : 'border-gray-300',
                  ].join(' ')}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center font-[family-name:var(--font-inter)]">
                {error}
              </p>
            )}

            {/* Submit */}
            <AdminButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Entrar
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 font-[family-name:var(--font-inter)]">
          &copy; {new Date().getFullYear()} Guinda Spa
        </p>
      </div>
    </div>
  )
}
