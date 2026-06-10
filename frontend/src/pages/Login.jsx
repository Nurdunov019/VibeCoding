import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api'
import { useApp } from '../context/AppContext'

export default function Login({ onLogin, user }) {
  const { t } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [botUsername, setBotUsername] = useState('')
  const [telegramEnabled, setTelegramEnabled] = useState(false)

  useEffect(() => {
    api.config().then((c) => {
      setBotUsername(c.telegram_bot_username)
      setTelegramEnabled(c.telegram_enabled)
    })

    if (window.Telegram?.WebApp?.initData) {
      setLoading(true)
      api.telegramWebApp(window.Telegram.WebApp.initData)
        .then((data) => onLogin(data.access_token))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [onLogin])

  useEffect(() => {
    if (!botUsername || !telegramEnabled) return
    window.onTelegramAuth = async (tgUser) => {
      setLoading(true)
      setError('')
      try {
        const data = await api.telegramLogin(tgUser)
        onLogin(data.access_token)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    const container = document.getElementById('telegram-login-btn')
    if (container && !container.hasChildNodes()) {
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.async = true
      script.setAttribute('data-telegram-login', botUsername)
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      container.appendChild(script)
    }
  }, [botUsername, telegramEnabled, onLogin])

  if (user) return <Navigate to="/panel" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(username, password)
      onLogin(data.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{t('loginTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('username')}</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ahmad"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <div className="password-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? t('hidePassword') : t('showPassword')}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? t('waiting') : t('login')}
          </button>
        </form>

        {telegramEnabled && botUsername && (
          <div className="telegram-login-section">
            <p className="divider-text">— {t('telegramLogin')} —</p>
            <div id="telegram-login-btn" className="telegram-widget-wrap" />
            <p className="telegram-hint">{t('telegramHint')}</p>
          </div>
        )}

        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
          {t('demo')}
        </p>
      </div>
    </div>
  )
}
