import Reveal from './Reveal'

export default function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <Reveal className={`wd-section-title ${className}`.trim()}>
      <span className="wd-section-title-line" aria-hidden />
      <h2 className="wd-section-title-text">{children}</h2>
      {subtitle && <p className="wd-section-title-sub">{subtitle}</p>}
    </Reveal>
  )
}
