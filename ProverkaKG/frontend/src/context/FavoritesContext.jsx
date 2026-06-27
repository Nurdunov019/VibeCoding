import { createContext, useContext, useEffect, useState } from 'react'
import { readJsonStorage, writeStorage } from '../utils/safeStorage'

const FavoritesContext = createContext(null)
const STORAGE_KEY = 'proverkakg_favorites'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readJsonStorage(STORAGE_KEY, []))

  useEffect(() => {
    writeStorage(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggle = (slug) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite: (s) => favorites.includes(s), count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
