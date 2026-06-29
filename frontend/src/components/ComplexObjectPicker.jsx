import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'

export default function ComplexObjectPicker({ complexes, value, onChange, required }) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = complexes.find((c) => c.slug === value)

  useEffect(() => {
    if (!open) {
      document.body.classList.remove('contact-picker-open')
      return undefined
    }
    document.body.classList.add('contact-picker-open')
    const close = (e) => {
      if (rootRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    const touchTimer = window.setTimeout(() => {
      document.addEventListener('touchstart', close, { passive: true })
    }, 100)
    return () => {
      document.body.classList.remove('contact-picker-open')
      window.clearTimeout(touchTimer)
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`contact-object-picker${open ? ' contact-object-picker--open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="contact-object-trigger"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected ? (
          <>
            <span className="contact-object-thumb">
              {selected.image_url ? (
                <img src={mediaUrl(selected.image_url)} alt="" />
              ) : (
                <span className="contact-object-thumb-ph" aria-hidden>🏢</span>
              )}
            </span>
            <span className="contact-object-label">{selected.name}</span>
          </>
        ) : (
          <span className="contact-object-placeholder">{t('contact.noObjects')}</span>
        )}
        <span className="contact-object-chevron" aria-hidden>▾</span>
      </button>

      {required && (
        <input
          type="text"
          className="contact-object-native-req"
          value={value || ''}
          readOnly
          required
          tabIndex={-1}
          aria-hidden
        />
      )}

      {open && (
        <ul className="contact-object-list" role="listbox">
          {complexes.map((c) => (
            <li key={c.slug} role="option" aria-selected={value === c.slug}>
              <button
                type="button"
                className={`contact-object-option${value === c.slug ? ' active' : ''}`}
                onClick={() => {
                  onChange(c.slug)
                  setOpen(false)
                }}
              >
                <span className="contact-object-thumb">
                  {c.image_url ? (
                    <img src={mediaUrl(c.image_url)} alt="" />
                  ) : (
                    <span className="contact-object-thumb-ph" aria-hidden>🏢</span>
                  )}
                </span>
                <span className="contact-object-label">{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
