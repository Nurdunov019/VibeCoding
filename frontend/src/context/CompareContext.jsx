import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const CompareContext = createContext(null)
const STORAGE_KEY = 'proverkakg_compare'
const MIN = 2
const MAX = 4

export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [picking, setPicking] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  }, [slugs])

  const startPicking = useCallback(() => setPicking(true), [])
  const stopPicking = useCallback(() => setPicking(false), [])

  const toggle = (slug) => {
    setPicking(true)
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= MAX) return prev
      return [...prev, slug]
    })
  }

  const remove = (slug) => setSlugs((prev) => prev.filter((s) => s !== slug))

  const clear = () => {
    setSlugs([])
    setPicking(false)
  }

  return (
    <CompareContext.Provider value={{
      slugs,
      picking,
      startPicking,
      stopPicking,
      toggle,
      remove,
      clear,
      isSelected: (s) => slugs.includes(s),
      min: MIN,
      max: MAX,
      canCompare: slugs.length >= MIN,
      remaining: MAX - slugs.length,
    }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  return useContext(CompareContext)
}
