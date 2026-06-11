import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthModal } from '../context/AuthModalContext'

export default function Register() {
  const { openRegister } = useAuthModal()
  const navigate = useNavigate()

  useEffect(() => {
    openRegister()
    navigate('/', { replace: true })
  }, [openRegister, navigate])

  return null
}
