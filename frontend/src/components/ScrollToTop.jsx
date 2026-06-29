import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, state } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (state?.scrollToComplexes) return
    window.scrollTo(0, 0)
  }, [pathname, state?.scrollToComplexes])

  return null
}
