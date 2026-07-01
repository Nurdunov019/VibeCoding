import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LANGS } from '../i18n/translations'
import { useLocale } from '../context/LocaleContext'

function useMobileHeader() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 1023px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

export default function LanguageSwitcher() {
  const { lang, setLang } = useLocale()
  const isMobile = useMobileHeader()
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(null)
  const ref = useRef(null)
  const btnRef = useRef(null)

  const current = LANGS.find((l) => l.code === lang) || LANGS[0]

  const updateMenuPosition = () => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const menuWidth = Math.max(rect.width, 180)
    const left = Math.max(8, rect.right - menuWidth)
    setMenuStyle({
      top: rect.bottom + 6,
      left,
      width: menuWidth,
    })
  }

  useLayoutEffect(() => {
    if (!open || !isMobile) return undefined
    updateMenuPosition()
    const onReflow = () => updateMenuPosition()
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, true)
    return () => {
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow, true)
    }
  }, [open, isMobile])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const close = (e) => {
      if (ref.current?.contains(e.target)) return
      const menu = document.getElementById('lang-picker-menu')
      if (menu?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close, { passive: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [open])

  if (!isMobile) {
    return (
      <select
        className="lang-select"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    )
  }

  const menu = open && menuStyle ? createPortal(
    <ul
      id="lang-picker-menu"
      className="lang-dropdown lang-dropdown--portal"
      role="listbox"
      style={menuStyle}
    >
      {LANGS.map((l) => (
        <li key={l.code} role="option" aria-selected={lang === l.code}>
          <button
            type="button"
            className={lang === l.code ? 'active' : ''}
            onClick={() => {
              setLang(l.code)
              setOpen(false)
            }}
          >
            <span>{l.label}</span>
            {lang === l.code && <span className="lang-check">✓</span>}
          </button>
        </li>
      ))}
    </ul>,
    document.body,
  ) : null

  return (
    <div className="lang-picker" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="lang-picker-btn"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? 'lang-picker-menu' : undefined}
        aria-label="Language"
      >
        <span className="lang-picker-label">{current.label}</span>
        <span className="lang-chevron" aria-hidden>▾</span>
      </button>
      {menu}
    </div>
  )
}
