import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useLocale } from '../context/LocaleContext'
import AuthModal from './AuthModal'
import LanguageSwitcher from './LanguageSwitcher'
import RegionPicker from './RegionPicker'
import CompareBar from './CompareBar'
import MobileNav from './MobileNav'
import MobileProfileSheet from './MobileProfileSheet'
import { useMobileNavScroll } from '../hooks/useMobileNavScroll'
import { isShowcasePath } from '../utils/showcaseSlug'

export default function Layout() {
  const { pathname } = useLocation()
  const { user, logout, loading } = useAuth()
  const { t } = useLocale()
  const { openLogin, openRegister } = useAuthModal()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [showcaseHeaderLight, setShowcaseHeaderLight] = useState(false)
  const { hidden: navHidden } = useMobileNavScroll()

  useEffect(() => {
    setProfileOpen(false)
  }, [pathname])

  const isShowcasePage = isShowcasePath(pathname)

  useEffect(() => {
    if (!isShowcasePage) {
      setShowcaseHeaderLight(false)
      return undefined
    }
    let observer
    const attach = () => {
      const info = document.getElementById('info')
      if (!info) return false
      observer = new IntersectionObserver(
        ([entry]) => setShowcaseHeaderLight(entry.isIntersecting),
        { threshold: 0, rootMargin: '-56px 0px 0px 0px' },
      )
      observer.observe(info)
      return true
    }
    if (!attach()) {
      const frame = requestAnimationFrame(() => attach())
      return () => {
        cancelAnimationFrame(frame)
        observer?.disconnect()
      }
    }
    return () => observer?.disconnect()
  }, [isShowcasePage, pathname])

  const closeProfile = () => setProfileOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={`app${isShowcasePage ? ' app--showcase' : ''}`}>
      <header className={`header${isShowcasePage && showcaseHeaderLight ? ' header--showcase-light' : ''}`}>
        <div className="container header-top">
          <RegionPicker />

          <Link to="/" className="logo header-logo">
            <span className="logo-mark desktop-only-inline">✓</span>
            <div>
              <span className="logo-text">ProverkaKG</span>
              <span className="logo-tag desktop-only-inline">{t('tagline')}</span>
            </div>
          </Link>

          <div className="header-mobile-actions">
            <LanguageSwitcher />
          </div>

          <nav className="nav-menu desktop-only">
            <Link to="/" className={pathname === '/' ? 'active' : ''}>{t('nav.complexes')}</Link>
            <Link to="/map" className={pathname === '/map' ? 'active' : ''}>{t('nav.map')}</Link>
            <Link to="/compare" className={pathname === '/compare' ? 'active' : ''}>{t('nav.compare')}</Link>
          </nav>

          <div className="header-actions desktop-only">
            <LanguageSwitcher />
            {loading ? null : user ? (
              <div className="user-menu">
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

      <CompareBar navHidden={navHidden} />

      <main className={`main${isShowcasePage ? ' main--immersive' : ' container'}`}>
        <Outlet />
      </main>

      <footer id="about" className={`footer${pathname.startsWith('/admin') ? ' footer-admin-mobile' : ''}`}>
        <div className="container footer-grid">
          <div>
            <h3>ProverkaKG</h3>
            <p>{t('footer.about')}</p>
          </div>
          <div>
            <h4>{t('footer.sections')}</h4>
            <Link to="/">{t('nav.complexes')}</Link>
            <Link to="/map">{t('nav.map')}</Link>
            <Link to="/favorites">{t('features.favorites')}</Link>
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

      <MobileNav
        koshuuOpen={profileOpen}
        onKoshuu={() => setProfileOpen((v) => !v)}
        onNavClick={closeProfile}
      />
      <MobileProfileSheet open={profileOpen} onClose={closeProfile} />
      <AuthModal />
    </div>
  )
}
