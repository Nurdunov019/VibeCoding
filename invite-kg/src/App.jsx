import { HashRouter } from 'react-router-dom'
import { WeddingThemeProvider } from './context/WeddingThemeContext'
import AnimatedRoutes from './components/PageTransition'
import './styles/themes.css'
import './styles/animations.css'
import './styles/landing.css'
import './styles/catalog.css'
import './styles/invitation.css'
import './styles/premium.css'
import './styles/wedding.css'

export default function App() {
  return (
    <WeddingThemeProvider>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </WeddingThemeProvider>
  )
}
