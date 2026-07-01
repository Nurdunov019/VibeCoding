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

function LangMenu({ lang, onPick, className, style, id }) {
  return (
    <ul id={id} className={className} role="listbox" style={style}>
      {LANGS.map((l) => (
        <li key={l.code} role="option" aria-selected={lang === l.code}>
          <button
            type="button"
            className={lang === l.code ? 'active' : ''}
            onClick={() => onPick(l.code)}
            aria-label={l.label}
            title={l.label}
          >
            <span className="lang-flag" aria-hidden>{l.flag}</span>
            {lang === l.code && <span className="lang-check">✓</span>}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function LanguageSwitcher() {
  const { lang, setLang } = useLocale()
  const isMobile = useMobileHeader()
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(null)
  const ref = useRef(null)
  const btnRef = useRef(null)

  const current = LANGS.find((l) => l.code === lang) || LANGS[0]

  const pick = (code) => {
    setLang(code)
    setOpen(false)
  }

  const updateMenuPosition = () => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const menuWidth = 56
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

  const menuProps = {
    id: 'lang-picker-menu',
    lang,
    onPick: pick,
    className: `lang-dropdown lang-dropdown--flags${isMobile ? ' lang-dropdown--portal' : ''}`,
    style: isMobile ? menuStyle : undefined,
  }

  const menu = open && (!isMobile || menuStyle) ? (
    isMobile
      ? createPortal(<LangMenu {...menuProps} />, document.body)
      : <LangMenu {...menuProps} />
  ) : null

  return (
    <div className={`lang-picker${open ? ' lang-picker--open' : ''}`} ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="lang-picker-btn lang-picker-btn--flag"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={current.label}
        title={current.label}
      >
        <span className="lang-flag" aria-hidden>{current.flag}</span>
      </button>
      {menu}
    </div>
  )
}
