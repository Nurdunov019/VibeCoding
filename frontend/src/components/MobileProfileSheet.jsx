import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useFavorites } from '../context/FavoritesContext'
import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'
import LanguageSwitcher from './LanguageSwitcher'

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileFavoritesTab({ onClose }) {
  const { favorites } = useFavorites()
  const { t } = useLocale()
  const [complexes, setComplexes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setComplexes([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    api.getComplexes()
      .then((all) => {
        const bySlug = new Map(all.map((c) => [c.slug, c]))
        setComplexes(favorites.map((slug) => bySlug.get(slug)).filter(Boolean))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [favorites])

  if (loading) return <p className="profile-tab-empty muted">{t('empty.loading')}</p>

  if (favorites.length === 0 || complexes.length === 0) {
    return (
      <div className="profile-tab-empty">
        <div className="profile-empty-art" aria-hidden>
          <span className="profile-empty-box">📦</span>
          <span className="profile-empty-glass">🔍</span>
        </div>
        <p className="profile-empty-title">{t('favorites.empty')}</p>
        <Link to="/" className="btn-outline btn-sm" onClick={onClose}>{t('favorites.browse')}</Link>
      </div>
    )
  }

  return (
    <ul className="profile-fav-list">
      {complexes.map((c) => (
        <li key={c.slug}>
          <Link to={`/complex/${c.slug}`} className="profile-fav-item" onClick={onClose}>
            <strong>{c.name}</strong>
            <span className="muted">{c.address}</span>
            {c.price_per_sqm_usd != null && (
              <span className="profile-fav-price">${c.price_per_sqm_usd} / м²</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function MobileProfileSheet({ open, onClose }) {
  const { user, logout, loading, refreshUser } = useAuth()
  const { openLogin, openRegister } = useAuthModal()
  const { t } = useLocale()
  const { pathname } = useLocation()
  const [tab, setTab] = useState('account')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef(null)

  if (!open) return null

  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleAvatarPick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setUploadingPhoto(true)
    setPhotoError('')
    try {
      await api.uploadAvatar(file)
      await refreshUser()
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const displayName = user?.full_name || t('profile.guestName')

  return (
    <div className="profile-sheet-backdrop" onClick={onClose}>
      <div
        className="profile-sheet profile-sheet--page"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('profile.title')}
      >
        <div className="profile-sheet-grab" aria-hidden />

        <header className="profile-page-head">
          <span className="profile-page-spacer" aria-hidden />
          <h2>{t('profile.title')}</h2>
          {user ? (
            <button type="button" className="profile-logout-btn" onClick={handleLogout} aria-label={t('profile.logout')}>
              <LogoutIcon />
            </button>
          ) : (
            <button type="button" className="profile-sheet-close" onClick={onClose} aria-label={t('profile.close')}>×</button>
          )}
        </header>

        <div className="profile-hero">
          {loading ? (
            <p className="muted">{t('empty.loading')}</p>
          ) : (
            <>
              <div className="profile-avatar-wrap">
                <button
                  type="button"
                  className={`profile-avatar profile-avatar--lg profile-avatar-btn${user ? '' : ' profile-avatar--guest'}`}
                  onClick={() => user && !uploadingPhoto && fileRef.current?.click()}
                  disabled={!user || uploadingPhoto}
                  aria-label={user ? t('profile.changePhoto') : displayName}
                >
                  {user?.avatar_url ? (
                    <img src={mediaUrl(user.avatar_url)} alt="" className="profile-avatar-img" />
                  ) : (
                    <span className="profile-avatar-fallback">{user ? user.full_name.charAt(0).toUpperCase() : '👤'}</span>
                  )}
                  {user && (
                    <span className="profile-avatar-badge" aria-hidden>📷</span>
                  )}
                </button>
                {user && (
                  <button
                    type="button"
                    className="profile-avatar-label"
                    onClick={() => !uploadingPhoto && fileRef.current?.click()}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? t('profile.uploadingPhoto') : t('profile.changePhoto')}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="profile-avatar-input"
                  onChange={handleAvatarPick}
                />
              </div>
              {photoError && <p className="profile-photo-error">{photoError}</p>}
              <p className="profile-hero-name">{displayName}</p>
              {user && <p className="profile-hero-email muted">{user.email}</p>}
              {!user && <p className="profile-hero-guest muted">{t('profile.guest')}</p>}
            </>
          )}
        </div>

        {!loading && !user && (
          <div className="profile-auth-actions">
            <button type="button" className="btn-accent btn-block" onClick={() => { openLogin(); onClose() }}>
              {t('auth.login')}
            </button>
            <button type="button" className="btn-outline btn-block" onClick={() => { openRegister(); onClose() }}>
              {t('auth.register')}
            </button>
          </div>
        )}

        <div className="profile-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'account'}
            className={tab === 'account' ? 'active' : ''}
            onClick={() => setTab('account')}
          >
            {t('profile.tabAccount')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'favorites'}
            className={tab === 'favorites' ? 'active' : ''}
            onClick={() => setTab('favorites')}
          >
            {t('profile.tabFavorites')}
          </button>
        </div>

        <div className="profile-tab-panel" role="tabpanel">
          {tab === 'account' ? (
            <nav className="profile-settings">
              {user?.is_admin && !pathname.startsWith('/admin') && (
                <Link to="/admin" className="profile-settings-item" onClick={onClose}>{t('nav.admin')}</Link>
              )}
              <div className="profile-settings-item profile-lang-row">
                <span>{t('profile.language')}</span>
                <LanguageSwitcher />
              </div>
            </nav>
          ) : (
            <ProfileFavoritesTab onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}
