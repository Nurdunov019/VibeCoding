import { useEffect, useRef } from 'react'

export function useAutoRefresh(callback, intervalMs = 30000) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') {
        savedCallback.current()
      }
    }
    tick()
    const id = setInterval(tick, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
}
