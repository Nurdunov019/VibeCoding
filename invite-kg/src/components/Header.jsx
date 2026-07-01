import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../config/site'

const nav = [
  { href: '#templates', label: 'Шаблондор' },
  { href: '#pricing', label: 'Тариф' },
  { href: '#reviews', label: 'Пикирлер' },
  { href: '#faq', label: 'Суроо-жооп' },
  { href: '#contact', label: 'Байланыш' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-script">{SITE.name}</span>
          <span className="logo-sub">{SITE.tagline}</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>

        <nav className={`site-nav${open ? ' site-nav--open' : ''}`}>
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
          <Link to="/demo" className="btn btn-gold btn-sm" onClick={() => setOpen(false)}>Демо</Link>
        </nav>
      </div>
    </header>
  )
}
