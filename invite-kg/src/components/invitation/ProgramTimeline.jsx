import { useReveal } from '../../hooks/useReveal'

export default function ProgramTimeline({ items }) {
  const { ref, visible } = useReveal({ threshold: 0.2 })

  return (
    <ul
      ref={ref}
      className={`w-inv-program-list timeline-draw${visible ? ' timeline-draw--visible' : ''}`}
    >
      {items.map((item, i) => (
        <li key={item.time} style={{ '--i': i }}>
          <span className="w-inv-program-icon" aria-hidden>{item.icon || '•'}</span>
          <div className="w-inv-program-body">
            <span className="w-inv-program-time">{item.time}</span>
            <span className="w-inv-program-title">{item.title}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
