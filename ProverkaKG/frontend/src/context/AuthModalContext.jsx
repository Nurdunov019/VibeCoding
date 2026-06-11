import { createContext, useContext, useState } from 'react'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [mode, setMode] = useState(null)

  const openLogin = () => setMode('login')
  const openRegister = () => setMode('register')
  const close = () => setMode(null)

  return (
    <AuthModalContext.Provider value={{ mode, openLogin, openRegister, close, isOpen: !!mode }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext)
}
