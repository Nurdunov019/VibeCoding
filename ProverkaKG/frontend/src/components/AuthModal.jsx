import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useLocale } from '../context/LocaleContext'

export default function AuthModal() {
  const { mode, close, openLogin, openRegister, isOpen } = useAuthModal()
  const { login, register } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [emailTaken, setEmailTaken] = useState(false)
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
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

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
      setError(err.message)
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
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const switchToLogin = () => {
    setError('')
    setEmailTaken(false)
    openLogin()
  }

  return (
    <div className="modal-overlay" onClick={close} role="presentation">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>

        <div className="modal-header">
          <span className="modal-logo">✓</span>
          <h2>{mode === 'login' ? t('auth.login') : t('auth.register')}</h2>
        </div>

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
          <form onSubmit={handleLogin} className="modal-form">
            <label>
              {t('auth.email')}
              <input type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </label>
            <label>
              {t('auth.password')}
              <div className="password-wrap">
                <input type={showPass ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </label>
            <button type="submit" className="btn-accent btn-block" disabled={loading}>
              {loading ? '...' : t('auth.login')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="modal-form">
            <label>
              {t('auth.fullName')}
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoFocus />
            </label>
            <label>
              {t('auth.email')}
              <input type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              {t('auth.password')}
              <div className="password-wrap">
                <input type={showPass ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </label>
            <button type="submit" className="btn-accent btn-block" disabled={loading}>
              {loading ? '...' : t('auth.register')}
            </button>
          </form>
        )}

        <p className="modal-footer">
          {mode === 'login' ? (
            <>
              {t('auth.noAccount')}{' '}
              <button type="button" className="modal-link" onClick={openRegister}>{t('auth.register')}</button>
            </>
          ) : (
            <>
              {t('auth.hasAccount')}{' '}
              <button type="button" className="modal-link" onClick={openLogin}>{t('auth.login')}</button>
            </>
          )}
        </p>

        {mode === 'login' && (
          <p className="auth-demo muted">admin@proverkakg.kg / admin123</p>
        )}
      </div>
    </div>
  )
}
