import { Link } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants/regions'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useLocale } from '../context/LocaleContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function MobileProfileSheet({ open, onClose }) {
  const { user, logout, loading } = useAuth()
  const { openLogin, openRegister } = useAuthModal()
  const { t } = useLocale()

  if (!open) return null

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div className="profile-sheet-backdrop" onClick={onClose}>
      <div className="profile-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="profile-sheet-head">
          <h2>{t('profile.title')}</h2>
          <button type="button" className="profile-sheet-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {loading ? (
          <p className="muted profile-sheet-muted">{t('empty.loading')}</p>
        ) : user ? (
          <div className="profile-user-card">
            <span className="profile-avatar">{user.full_name.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{user.full_name}</strong>
              <span className="muted">{user.email}</span>
            </div>
          </div>
        ) : (
          <p className="muted profile-sheet-muted">{t('profile.guest')}</p>
        )}

        <nav className="profile-menu">
          {!user && (
            <>
              <button type="button" className="profile-menu-item" onClick={() => { openLogin(); onClose() }}>
                {t('auth.login')}
              </button>
              <button type="button" className="profile-menu-item accent" onClick={() => { openRegister(); onClose() }}>
                {t('auth.register')}
              </button>
            </>
          )}
          {user?.is_admin && (
            <Link to="/admin" className="profile-menu-item" onClick={onClose}>{t('nav.admin')}</Link>
          )}
          <Link to="/compare" className="profile-menu-item" onClick={onClose}>{t('nav.compare')}</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="profile-menu-item" onClick={onClose}>
            {t('whatsapp.label')}
          </a>
          <div className="profile-menu-item profile-lang-row">
            <span>{t('profile.language')}</span>
            <LanguageSwitcher />
          </div>
          {user && (
            <button type="button" className="profile-menu-item danger" onClick={handleLogout}>
              {t('auth.logout')}
            </button>
          )}
        </nav>
      </div>
    </div>
  )
}
