import { BrowserRouter } from 'react-router-dom'
import { WeddingThemeProvider } from './context/WeddingThemeContext'
import AnimatedRoutes from './components/PageTransition'
import './styles/themes.css'
import './styles/animations.css'
import './styles/landing.css'
import './styles/catalog.css'
import './styles/invitation.css'

export default function App() {
  return (
    <WeddingThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </WeddingThemeProvider>
  )
}
