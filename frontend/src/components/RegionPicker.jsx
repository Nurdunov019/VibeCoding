import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { REGIONS } from '../constants/regions'
import { useLocale } from '../context/LocaleContext'
import { useRegion } from '../context/RegionContext'

export default function RegionPicker() {
  const { region, setRegion } = useRegion()
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(null)
  const ref = useRef(null)
  const btnRef = useRef(null)

  const current = REGIONS.find((r) => r.slug === region) || REGIONS[0]

  const updateMenuPosition = () => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const menuWidth = Math.max(rect.width, 220)
    const left = Math.max(8, rect.right - menuWidth)
    setMenuStyle({
      top: rect.bottom + 6,
      left,
      width: menuWidth,
    })
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    updateMenuPosition()
    const onReflow = () => updateMenuPosition()
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, true)
    return () => {
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const close = (e) => {
      if (ref.current?.contains(e.target)) return
      const menu = document.getElementById('region-picker-menu')
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

  const menu = open && menuStyle ? createPortal(
    <ul
      id="region-picker-menu"
      className="region-dropdown region-dropdown--portal"
      role="listbox"
      style={menuStyle}
    >
      {REGIONS.map((r) => (
        <li key={r.slug} role="option" aria-selected={region === r.slug}>
          <button
            type="button"
            className={region === r.slug ? 'active' : ''}
            onClick={() => {
              setRegion(r.slug)
              setOpen(false)
            }}
          >
            <span>{t(`regions.${r.key}`)}</span>
            {region === r.slug && <span className="region-check">✓</span>}
          </button>
        </li>
      ))}
    </ul>,
    document.body,
  ) : null

  return (
    <div className="region-picker" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="region-picker-btn"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? 'region-picker-menu' : undefined}
      >
        <span className="region-pin" aria-hidden>📍</span>
        <span className="region-label">{t(`regions.${current.key}`)}</span>
        <span className="region-chevron" aria-hidden>▾</span>
      </button>
      {menu}
    </div>
  )
}
