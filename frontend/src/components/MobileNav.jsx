import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 01-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 014 19v-8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconObjects() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20V9l8-5 8 5v11" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconMap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6l6-2 6 2 4-1.5v13l-4 1.5-6-2-6 2-4-1.5V4.5l4 1.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 4v13M16 6v13" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13" cy="10" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconAdmin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconAdd() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function MobileNav({ koshuuOpen, onKoshuu }) {
  const { pathname, hash } = useLocation()
  const { user } = useAuth()
  const { t } = useLocale()

  const showAdminTab = !!user?.is_admin

  const isHome = pathname === '/' && hash !== '#complexes'
  const isObjects = pathname.startsWith('/complex') || (pathname === '/' && hash === '#complexes')
  const isMap = pathname === '/map'
  const isAdmin = pathname.startsWith('/admin')

  const itemClass = (active) => `mobile-nav-item${active ? ' active' : ''}`

  return (
    <nav className={`mobile-nav${showAdminTab ? ' mobile-nav-admin' : ''}`} aria-label={t('mobileNav.label')}>
      <Link to="/" className={itemClass(isHome)}>
        <IconHome />
        <span>{t('mobileNav.home')}</span>
      </Link>
      <Link to="/#complexes" className={itemClass(isObjects)}>
        <IconObjects />
        <span>{t('mobileNav.objects')}</span>
      </Link>
      <Link to="/map" className={itemClass(isMap)}>
        <IconMap />
        <span>{t('mobileNav.map')}</span>
      </Link>
      {showAdminTab && (
        <Link to="/admin" className={itemClass(isAdmin)}>
          <IconAdmin />
          <span>{t('nav.admin')}</span>
        </Link>
      )}
      <button type="button" className={itemClass(koshuuOpen)} onClick={onKoshuu}>
        <IconAdd />
        <span>{t('mobileNav.add')}</span>
      </button>
    </nav>
  )
}
