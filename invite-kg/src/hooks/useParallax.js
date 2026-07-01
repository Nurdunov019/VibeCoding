import { useEffect, useRef } from 'react'

export function useParallax(speed = 0.2) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const offset = (center - window.innerHeight / 2) * speed
      el.style.setProperty('--parallax-y', `${offset}px`)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return ref
}
