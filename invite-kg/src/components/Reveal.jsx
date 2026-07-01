import { useReveal } from '../hooks/useReveal'

const VARIANT_CLASS = {
  up: '',
  blur: ' reveal--blur',
  fade: ' reveal--fade',
  slide: '',
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  ...rest
}) {
  const { ref, visible } = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal${VARIANT_CLASS[variant] ?? ''}${visible ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
