import { motion } from 'framer-motion'

export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = motion.div,
  ...rest
}) {
  const Component = Tag

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.75, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Component>
  )
}
