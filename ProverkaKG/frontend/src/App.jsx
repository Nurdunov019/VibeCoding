import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CompareProvider } from './context/CompareContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { LocaleProvider } from './context/LocaleContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import ComplexDetail from './pages/ComplexDetail'
import LegalView from './pages/LegalView'
import Login from './pages/Login'
import Register from './pages/Register'
import MapPage from './pages/Map'
import Compare from './pages/Compare'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
      <AuthModalProvider>
      <AuthProvider>
        <FavoritesProvider>
        <CompareProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/complex/:slug" element={<ComplexDetail />} />
              <Route path="/legal/view/:token" element={<LegalView />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </CompareProvider>
        </FavoritesProvider>
      </AuthProvider>
      </AuthModalProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}
