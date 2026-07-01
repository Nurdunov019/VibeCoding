const SECTIONS = [
  { id: 'pr-hero', label: '01' },
  { id: 'pr-invite', label: '02' },
  { id: 'pr-countdown', label: '03' },
  { id: 'pr-story', label: '04' },
  { id: 'pr-gallery', label: '05' },
  { id: 'pr-program', label: '06' },
  { id: 'pr-venue', label: '07' },
  { id: 'pr-dress', label: '08' },
  { id: 'pr-wishes', label: '09' },
  { id: 'pr-rsvp', label: '10' },
]

export default function PremiumChrome({ progress, activeSection }) {
  return (
    <>
      <div className="pr-scroll-progress" style={{ '--progress': progress }} aria-hidden />
      <nav className="pr-section-nav" aria-label="Секциялар">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pr-section-dot${activeSection === s.id ? ' pr-section-dot--active' : ''}`}
            title={s.label}
            onClick={() => {
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </nav>
      <div className="pr-cursor-light" aria-hidden />
    </>
  )
}
