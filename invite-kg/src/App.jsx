import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import InvitationPage from './pages/InvitationPage'
import './styles/landing.css'
import './styles/catalog.css'
import './styles/invitation.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<InvitationPage />} />
        <Route path="/i/:slug" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
