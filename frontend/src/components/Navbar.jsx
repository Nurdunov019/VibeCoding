import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function displayName(user, t) {
  if (user.role === 'teacher') return t('teacher')
  if (user.role === 'admin') return t('admin')
  return user.full_name
}

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation()
  const { lang, setLang, theme, toggleTheme, t } = useApp()
  const isHome = pathname === '/'

  return (
    <nav className="navbar">
      <Link to="/" className="logo">📖 Quran Tracker</Link>
      <div className="nav-links">
        {!isHome && (
          <Link to="/" className={pathname === '/' ? 'active' : ''}>{t('home')}</Link>
        )}

        <select
          className="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label={t('lang')}
        >
          <option value="ky">Кыргызча</option>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>

        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? t('themeLight') : t('themeDark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <Link to="/panel" className={pathname === '/panel' ? 'active' : ''}>
              {displayName(user, t)}
            </Link>
            <button onClick={onLogout}>{t('logout')}</button>
          </>
        ) : (
          !isHome && (
            <Link to="/login" className={pathname === '/login' ? 'active' : ''}>{t('login')}</Link>
          )
        )}
      </div>
    </nav>
  )
}
