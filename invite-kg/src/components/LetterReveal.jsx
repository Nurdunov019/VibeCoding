import { useReveal } from '../hooks/useReveal'

export default function LetterReveal({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
  threshold,
}) {
  const { ref, visible } = useReveal({ threshold: threshold ?? 0.15 })
  const chars = [...text]

  return (
    <Tag
      ref={ref}
      className={`letter-reveal${visible ? ' letter-reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--letter-base-delay': `${delay}ms` }}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{ '--i': i }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  )
}
