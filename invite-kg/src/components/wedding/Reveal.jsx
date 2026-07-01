import { motion } from 'framer-motion'

const defaultVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = motion.div,
  ...rest
}) {
  const Component = Tag === motion.div ? motion.div : Tag

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -40px 0px' }}
      variants={defaultVariants}
      transition={{ delay: delay / 1000 }}
      {...rest}
    >
      {children}
    </Component>
  )
}
