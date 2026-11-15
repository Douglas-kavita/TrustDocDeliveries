'use client'

import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react'

type Step = 'login' | 'sms' | 'forgot' | 'reset-code' | 'new-password'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('login')

  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function api(body: any) {
    const r = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const d = await r.json()

    if (!r.ok) {
      throw Error(d.error || 'Request failed')
    }

    return d
  }

  function clearNotices() {
    setError('')
    setMessage('')
  }

  function backToLogin() {
    clearNotices()
    setOtp('')
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setStep('login')
  }

  async function passkey() {
    setBusy(true)
    clearNotices()

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

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    clearNotices()

    try {
      if (step === 'login') {
        await api({
          action: 'password-start',
          email,
          password,
        })

        setOtp('')
        setStep('sms')
      } else if (step === 'sms') {
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

  async function startReset(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    clearNotices()

    try {
      const d = await api({
        action: 'password-reset-start',
        email,
      })

      setMessage(
        d.message ||
          'If this staff account exists, a security code has been sent.'
      )

      setOtp('')
      setStep('reset-code')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function verifyResetCode(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    clearNotices()

    try {
      const d = await api({
        action: 'password-reset-verify',
        email,
        otp,
      })

      setResetToken(d.resetToken)
      setStep('new-password')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function completeReset(e: React.FormEvent) {
    e.preventDefault()
    clearNotices()

    if (newPassword.length < 12) {
      setError('New password must contain at least 12 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('The two passwords do not match.')
      return
    }

    setBusy(true)

    try {
      const d = await api({
        action: 'password-reset-complete',
        email,
        resetToken,
        newPassword,
      })

      setPassword('')
      setOtp('')
      setResetToken('')
      setNewPassword('')
      setConfirmPassword('')
      setStep('login')

      setMessage(
        d.message ||
          'Password changed successfully. Sign in with your new password.'
      )
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-maroon-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-xl">

        <div className="flex items-center gap-3">
          <ShieldCheck className="text-maroon-dark" />
          <h1 className="text-xl font-bold">TrustDoc Admin</h1>
        </div>

        {step === 'login' && (
          <form onSubmit={submitLogin} className="space-y-4">
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
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  clearNotices()
                  setStep('forgot')
                }}
                className="text-sm font-medium text-maroon-dark hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p role="alert" className="text-red-700 text-sm">
                {error}
              </p>
            )}

            {message && (
              <p className="text-green-700 text-sm">
                {message}
              </p>
            )}

            <button
              className="btn-primary w-full py-2"
              disabled={busy}
            >
              {busy ? 'Please wait...' : 'Continue with password'}
            </button>
          </form>
        )}

        {step === 'sms' && (
          <form onSubmit={submitLogin} className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter the security code sent to your registered phone.
            </p>

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

            {error && (
              <p role="alert" className="text-red-700 text-sm">
                {error}
              </p>
            )}

            <button
              className="btn-primary w-full py-2"
              disabled={busy}
            >
              {busy ? 'Verifying...' : 'Verify SMS & sign in'}
            </button>

            <button
              type="button"
              onClick={backToLogin}
              className="w-full text-sm flex items-center justify-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </button>
          </form>
        )}

        {step === 'forgot' && (
          <form onSubmit={startReset} className="space-y-4">
            <div>
              <h2 className="font-semibold">Reset password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your Admin email. A security code will be sent to the
                registered phone number.
              </p>
            </div>

            <label className="block text-sm">
              Email
              <input
                type="email"
                autoComplete="email"
                className="input mt-1 w-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {error && (
              <p role="alert" className="text-red-700 text-sm">
                {error}
              </p>
            )}

            <button
              className="btn-primary w-full py-2"
              disabled={busy}
            >
              {busy ? 'Sending...' : 'Send security code'}
            </button>

            <button
              type="button"
              onClick={backToLogin}
              className="w-full text-sm flex items-center justify-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </button>
          </form>
        )}

        {step === 'reset-code' && (
          <form onSubmit={verifyResetCode} className="space-y-4">
            <div>
              <h2 className="font-semibold">Verify your identity</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter the 6-digit security code.
              </p>
            </div>

            {message && (
              <p className="text-green-700 text-sm">
                {message}
              </p>
            )}

            <label className="block text-sm">
              Security code
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

            {error && (
              <p role="alert" className="text-red-700 text-sm">
                {error}
              </p>
            )}

            <button
              className="btn-primary w-full py-2"
              disabled={busy}
            >
              {busy ? 'Verifying...' : 'Verify security code'}
            </button>

            <button
              type="button"
              onClick={backToLogin}
              className="w-full text-sm flex items-center justify-center gap-1"
            >
              <ArrowLeft size={16} />
              Cancel
            </button>
          </form>
        )}

        {step === 'new-password' && (
          <form onSubmit={completeReset} className="space-y-4">
            <div>
              <h2 className="font-semibold">Create new password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Use at least 12 characters.
              </p>
            </div>

            <label className="block text-sm">
              New password

              <div className="relative mt-1">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input w-full pr-11"
                  required
                  minLength={12}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                  aria-label={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <label className="block text-sm">
              Confirm new password

              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input w-full pr-11"
                  required
                  minLength={12}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <p role="alert" className="text-red-700 text-sm">
                {error}
              </p>
            )}

            <button
              className="btn-primary w-full py-2"
              disabled={busy}
            >
              {busy ? 'Changing password...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}