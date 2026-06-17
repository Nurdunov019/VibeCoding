import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useLocale } from '../context/LocaleContext'
import { translateApiError } from '../utils/translate'

function useDesktopFocus() {
  const [allow, setAllow] = useState(false)
  useEffect(() => {
    setAllow(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])
  return allow
}

const SUPPORT_EMAIL = 'admin@proverkakg.kg'

export default function AuthModal() {
  const { mode, close, openLogin, openRegister, isOpen } = useAuthModal()
  const { login, register } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()
  const allowAutoFocus = useDesktopFocus()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [emailTaken, setEmailTaken] = useState(false)
  const [forgotHint, setForgotHint] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setError('')
      setEmailTaken(false)
      setEmail('')
      setPassword('')
      setFullName('')
      setShowPass(false)
      setForgotHint(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  useEffect(() => {
    if (!isOpen) {
      document.documentElement.style.removeProperty('--keyboard-offset')
      return undefined
    }
    const vv = window.visualViewport
    if (!vv) return undefined

    const sync = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      document.documentElement.style.setProperty('--keyboard-offset', `${offset}px`)
    }
    sync()
    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    return () => {
      vv.removeEventListener('resize', sync)
      vv.removeEventListener('scroll', sync)
      document.documentElement.style.removeProperty('--keyboard-offset')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      close()
      if (user.is_admin) navigate('/admin')
    } catch (err) {
      setError(translateApiError(err.message, t))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, fullName)
      close()
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('ээлеген') || msg.toLowerCase().includes('taken') || msg.toLowerCase().includes('exists')) {
        setEmailTaken(true)
        setError(t('auth.emailTaken'))
      } else {
        setEmailTaken(false)
        setError(translateApiError(msg, t))
      }
    } finally {
      setLoading(false)
    }
  }

  const switchToLogin = () => {
    setError('')
    setEmailTaken(false)
    setForgotHint(false)
    openLogin()
  }

  const handleForgotPassword = () => {
    setError('')
    setForgotHint(true)
    const subject = encodeURIComponent(t('auth.forgotMailSubject'))
    const body = encodeURIComponent(t('auth.forgotMailBody', { email: email || '' }))
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
  }

  const forgotMailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t('auth.forgotMailSubject'))}&body=${encodeURIComponent(t('auth.forgotMailBody', { email: email || '' }))}`

  const EyeIcon = ({ open }) => (
    open ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 3l18 18M10.5 10.7A3 3 0 0012 15a3 3 0 002.3-4.3M7.4 7.5C8.8 6.5 10.3 6 12 6c5 0 9 6 9 6a15.6 15.6 0 01-3.2 3.8M5 9.5C3.6 10.6 2.5 12 2 12s3.5 6 10 6c1.2 0 2.3-.2 3.3-.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  )

  return (
    <div className="modal-overlay" onClick={close} role="presentation">
      <div className="modal-card auth-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>

        <div className="modal-header">
          <h2>{mode === 'login' ? t('auth.login') : t('auth.register')}</h2>
        </div>

        {forgotHint && mode === 'login' && (
          <div className="auth-info">
            {t('auth.forgotHint')}{' '}
            <a href={forgotMailto} className="modal-link">{SUPPORT_EMAIL}</a>
          </div>
        )}

        {error && (
          <div className="auth-error">
            {error}
            {emailTaken && (
              <button type="button" className="modal-link" style={{ display: 'block', marginTop: 8 }} onClick={switchToLogin}>
                → {t('auth.goLogin')}
              </button>
            )}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="modal-form" autoComplete="on">
            <label>
              {t('auth.email')}
              <input
                type="email"
                name="email"
                inputMode="email"
                autoComplete="username"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={allowAutoFocus}
              />
            </label>
            <label className="modal-field">
              {t('auth.password')}
              <div className="password-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1} aria-label="Toggle password">
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <button type="button" className="modal-forgot-link" onClick={handleForgotPassword}>
                {t('auth.forgotPassword')}
              </button>
            </label>
            <button type="submit" className="btn-accent btn-block modal-submit" disabled={loading}>
              {loading ? '...' : t('auth.login')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="modal-form" autoComplete="on">
            <label>
              {t('auth.fullName')}
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus={allowAutoFocus}
              />
            </label>
            <label>
              {t('auth.email')}
              <input
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              {t('auth.password')}
              <div className="password-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="new-password"
                  autoComplete="new-password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1} aria-label="Toggle password">
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </label>
            <button type="submit" className="btn-accent btn-block modal-submit" disabled={loading}>
              {loading ? '...' : t('auth.register')}
            </button>
          </form>
        )}

        <p className="modal-footer">
          {mode === 'login' ? (
            <>
              <span className="modal-footer-text">{t('auth.noAccount')}</span>{' '}
              <button type="button" className="modal-link" onClick={openRegister}>{t('auth.register')}</button>
            </>
          ) : (
            <>
              <span className="modal-footer-text">{t('auth.hasAccount')}</span>{' '}
              <button type="button" className="modal-link" onClick={openLogin}>{t('auth.login')}</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
