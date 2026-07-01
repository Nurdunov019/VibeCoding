import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'
import { readStorage, removeStorage, writeStorage } from '../utils/safeStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = readStorage('token')
    if (!token) {
      setLoading(false)
      return
    }
    api.me()
      .then(setUser)
      .catch(() => removeStorage('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { access_token } = await api.login(email, password)
    writeStorage('token', access_token)
    const me = await api.me()
    setUser(me)
    return me
  }

  const register = async (email, password, full_name) => {
    await api.register(email, password, full_name)
    return login(email, password)
  }

  const logout = () => {
    removeStorage('token')
    setUser(null)
  }

  const refreshUser = async () => {
    const me = await api.me()
    setUser(me)
    return me
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
