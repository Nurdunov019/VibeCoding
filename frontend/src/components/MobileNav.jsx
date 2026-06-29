import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCompare } from '../context/CompareContext'
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 01-1.5 1.5H5.5A1.5 1.5 0 014 19V10.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12.5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

function IconCompare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 4h12M8 10h8M8 16h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 4v4M4 10v4M4 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function MobileNav({ koshuuOpen, onKoshuu, onNavClick }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { startPicking } = useCompare()
  const { t } = useLocale()

  const showAdminTab = !!user?.is_admin

  const isHome = pathname === '/'
  const isObjects = pathname.startsWith('/complex')
  const isMap = pathname === '/map'
  const isCompare = pathname === '/compare'
  const isAdmin = pathname.startsWith('/admin')

  const itemClass = (active) => `mobile-nav-item${active ? ' active' : ''}`

  const beforeNav = () => {
    onNavClick?.()
    window.scrollTo(0, 0)
  }

  const goHome = () => {
    beforeNav()
    navigate('/')
  }

  const goObjects = () => {
    beforeNav()
    if (pathname === '/') {
      document.getElementById('complexes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/', { state: { scrollToComplexes: true } })
    }
  }

  const goMap = () => {
    beforeNav()
    navigate('/map')
  }

  const goCompare = () => {
    beforeNav()
    startPicking()
    navigate('/compare')
  }

  const goAdmin = () => {
    beforeNav()
    navigate('/admin')
  }

  const handleKoshuu = () => {
    onKoshuu?.()
  }

  return (
    <nav
      className={`mobile-nav${showAdminTab ? ' mobile-nav-admin' : ''}`}
      aria-label={t('mobileNav.label')}
    >
      <button type="button" className={itemClass(isHome)} onClick={goHome}>
        <IconHome />
        <span>{t('mobileNav.home')}</span>
      </button>
      <button type="button" className={itemClass(isObjects)} onClick={goObjects}>
        <IconObjects />
        <span>{t('mobileNav.objects')}</span>
      </button>
      <button type="button" className={itemClass(isMap)} onClick={goMap}>
        <IconMap />
        <span>{t('mobileNav.map')}</span>
      </button>
      <button type="button" className={itemClass(isCompare)} onClick={goCompare}>
        <IconCompare />
        <span>{t('mobileNav.compare')}</span>
      </button>
      {showAdminTab && (
        <button type="button" className={itemClass(isAdmin)} onClick={goAdmin}>
          <IconAdmin />
          <span>{t('nav.admin')}</span>
        </button>
      )}
      <button type="button" className={itemClass(koshuuOpen)} onClick={handleKoshuu}>
        <IconProfile />
        <span>{t('mobileNav.profile')}</span>
      </button>
    </nav>
  )
}
