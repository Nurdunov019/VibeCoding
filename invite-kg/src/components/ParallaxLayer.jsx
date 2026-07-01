import { useParallax } from '../hooks/useParallax'

export default function ParallaxLayer({
  children,
  className = '',
  speed = 0.2,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useParallax(speed)

  return (
    <Tag ref={ref} className={`parallax-layer${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </Tag>
  )
}
