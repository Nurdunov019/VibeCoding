import { createContext, useContext, useEffect, useState } from 'react'

const RegionContext = createContext(null)
const STORAGE_KEY = 'proverkakg_region_v2'

export function RegionProvider({ children }) {
  const [region, setRegionState] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    return localStorage.getItem(STORAGE_KEY) || 'all'
  })

  const setRegion = (value) => {
    setRegionState(value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, region)
  }, [region])

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within RegionProvider')
  return ctx
}
