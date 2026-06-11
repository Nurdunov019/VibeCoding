import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthModal } from '../context/AuthModalContext'

export default function Login() {
  const { openLogin } = useAuthModal()
  const navigate = useNavigate()

  useEffect(() => {
    openLogin()
    navigate('/', { replace: true })
  }, [openLogin, navigate])

  return null
}
