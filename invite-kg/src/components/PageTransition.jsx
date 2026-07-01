import { useLocation, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import InvitationPage from '../pages/InvitationPage'

export default function AnimatedRoutes() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<InvitationPage />} />
        <Route path="/i/:slug" element={<InvitationPage />} />
      </Routes>
    </div>
  )
}
