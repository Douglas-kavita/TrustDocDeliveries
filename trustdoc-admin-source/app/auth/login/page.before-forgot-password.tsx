'use client'

import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'login' | 'sms'>('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function api(body: any) {
    const r = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const d = await r.json()

    if (!r.ok) {
      throw Error(d.error || 'Sign-in failed')
    }

    return d
  }

  async function passkey() {
    setBusy(true)
    setError('')

    try {
      const o = await api({
        action: 'passkey-options',
        email,
      })

      const response = await startAuthentication({
        optionsJSON: o,
      })

      await api({
        action: 'passkey-verify',
        email,
        response,
      })

      location.assign('/dashboard')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      if (step === 'login') {
        await api({
          action: 'password-start',
          email,
          password,
        })

        setStep('sms')
      } else {
        await api({
          action: 'password-verify',
          email,
          otp,
        })

        location.assign('/dashboard')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-maroon-dark flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-maroon-dark" />
          <h1 className="text-xl font-bold">TrustDoc Admin</h1>
        </div>

        <p className="text-sm text-gray-500">
          Secure staff access. Use a passkey, or password + SMS verification
          as fallback.
        </p>

        <label className="block text-sm">
          Email
          <input
            type="email"
            autoComplete="username webauthn"
            className="input mt-1 w-full"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {step === 'login' && (
          <>
            <button
              type="button"
              onClick={passkey}
              disabled={busy || !email}
              className="btn-primary w-full py-2 flex justify-center gap-2"
            >
              <KeyRound size={18} />
              Sign in with passkey
            </button>

            <div className="text-center text-xs text-gray-400">
              or use fallback
            </div>

            <label className="block text-sm">
              Password

              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input w-full pr-11"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-maroon-dark"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </label>
          </>
        )}

        {step === 'sms' && (
          <label className="block text-sm">
            SMS security code
            <input
              className="input mt-1 w-full"
              required
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ''))
              }
            />
          </label>
        )}

        {error && (
          <p role="alert" className="text-red-700 text-sm">
            {error}
          </p>
        )}

        {step === 'login' ? (
          <button
            className="btn-primary w-full py-2"
            disabled={busy}
          >
            {busy ? 'Please wait...' : 'Continue with password'}
          </button>
        ) : (
          <button
            className="btn-primary w-full py-2"
            disabled={busy}
          >
            {busy ? 'Verifying...' : 'Verify SMS & sign in'}
          </button>
        )}
      </form>
    </div>
  )
}