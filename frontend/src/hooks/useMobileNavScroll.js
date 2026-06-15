import { useEffect, useRef, useState } from 'react'

const MOBILE_MAX = 1023
const SCROLL_THRESHOLD = 8
const TOP_OFFSET = 56

export function useMobileNavScroll() {
  const [hidden, setHidden] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const sync = () => setEnabled(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return undefined
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY.current

        if (y <= TOP_OFFSET) {
          setHidden(false)
        } else if (delta > SCROLL_THRESHOLD) {
          setHidden(true)
        } else if (delta < -SCROLL_THRESHOLD) {
          setHidden(false)
        }

        lastY.current = y
        ticking = false
      })
    }

    lastY.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  return { hidden: enabled && hidden, enabled }
}
