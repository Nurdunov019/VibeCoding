import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useCompare } from '../context/CompareContext'
import { useLocale } from '../context/LocaleContext'
import AuthModal from './AuthModal'
import CompareBar from './CompareBar'
import LanguageSwitcher from './LanguageSwitcher'
import WhatsAppButton from './WhatsAppButton'

export default function Layout() {
  const { pathname } = useLocation()
  const { user, logout, loading } = useAuth()
  const { slugs } = useCompare()
  const { t } = useLocale()
  const { openLogin, openRegister } = useAuthModal()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-top">
          <Link to="/" className="logo">
            <span className="logo-mark">✓</span>
            <div>
              <span className="logo-text">ProverkaKG</span>
              <span className="logo-tag">{t('tagline')}</span>
            </div>
          </Link>

          <nav className="nav-menu">
            <Link to="/" className={pathname === '/' ? 'active' : ''}>{t('nav.complexes')}</Link>
            <Link to="/map" className={pathname === '/map' ? 'active' : ''}>{t('nav.map')}</Link>
            <Link to="/compare" className={pathname === '/compare' ? 'active' : ''}>
              {t('nav.compare')}
              {slugs.length > 0 && <span className="nav-badge">{slugs.length}</span>}
            </Link>
          </nav>

          <div className="header-actions">
            <LanguageSwitcher />
            {loading ? null : user ? (
              <div className="user-menu">
                <span className="user-name">{user.full_name}</span>
                {user.is_admin && <Link to="/admin" className="btn-outline btn-sm">{t('nav.admin')}</Link>}
                <button type="button" className="btn-ghost btn-sm" onClick={handleLogout}>{t('auth.logout')}</button>
              </div>
            ) : (
              <>
                <button type="button" className="btn-outline btn-sm" onClick={openLogin}>{t('auth.login')}</button>
                <button type="button" className="btn-accent btn-sm" onClick={openRegister}>{t('auth.register')}</button>
              </>
            )}
          </div>
        </div>
      </header>

      <CompareBar />

      <main className="main container">
        <Outlet />
      </main>

      <footer id="about" className="footer">
        <div className="container footer-grid">
          <div>
            <h3>ProverkaKG</h3>
            <p>{t('footer.about')}</p>
          </div>
          <div>
            <h4>{t('footer.sections')}</h4>
            <Link to="/">{t('nav.complexes')}</Link>
            <Link to="/map">{t('nav.map')}</Link>
            <Link to="/compare">{t('nav.compare')}</Link>
          </div>
          <div>
            <h4>{t('footer.security')}</h4>
            <p className="muted">{t('footer.securityText')}</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 ProverkaKG</span>
        </div>
      </footer>

      <WhatsAppButton />
      <AuthModal />
    </div>
  )
}
