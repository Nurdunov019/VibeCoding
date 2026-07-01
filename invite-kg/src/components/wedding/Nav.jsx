import { useEffect, useState } from 'react'
import { WEDDING_NAV } from '../../data/weddingInvitation'

export default function Nav({ opened, onOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(WEDDING_NAV[0].id)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = WEDDING_NAV.map((n) => n.id)
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0, 0.2, 0.4] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [opened])

  const goTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!opened) return null

  return (
    <header className={`wd-nav${scrolled ? ' wd-nav--scrolled' : ''}`}>
      <div className="wd-nav-inner">
        <a href="#wd-hero" className="wd-nav-logo" onClick={(e) => { e.preventDefault(); goTo('wd-hero') }}>
          A & M
        </a>
        <nav className={`wd-nav-links${menuOpen ? ' wd-nav-links--open' : ''}`}>
          {WEDDING_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`wd-nav-link${active === item.id ? ' wd-nav-link--active' : ''}`}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className={`wd-nav-burger${menuOpen ? ' wd-nav-burger--open' : ''}`}
          aria-label="Меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
