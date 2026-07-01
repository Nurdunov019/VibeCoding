import { Children, cloneElement, isValidElement } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function StaggerReveal({
  children,
  className = '',
  delay = 0,
  step = 80,
  as: Tag = 'div',
  ...rest
}) {
  const { ref, visible } = useReveal()

  const items = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child
    return cloneElement(child, {
      className: `${child.props.className || ''} stagger-child`.trim(),
      style: {
        ...child.props.style,
        '--stagger-i': i,
        '--stagger-step': `${step}ms`,
        '--reveal-delay': `${delay}ms`,
      },
    })
  })

  return (
    <Tag
      ref={ref}
      className={`stagger-reveal${visible ? ' stagger-reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {items}
    </Tag>
  )
}
