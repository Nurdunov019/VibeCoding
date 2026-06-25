import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { LocaleProvider } from './context/LocaleContext'
import { RegionProvider } from './context/RegionContext'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'

const ComplexDetail = lazy(() => import('./pages/ComplexDetail'))
const LegalView = lazy(() => import('./pages/LegalView'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const MapPage = lazy(() => import('./pages/Map'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LocaleProvider>
      <RegionProvider>
      <AuthModalProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/complex/:slug" element={<Suspense fallback={<PageLoader />}><ComplexDetail /></Suspense>} />
              <Route path="/legal/view/:token" element={<Suspense fallback={<PageLoader />}><LegalView /></Suspense>} />
              <Route path="/map" element={<Suspense fallback={<PageLoader />}><MapPage /></Suspense>} />
              <Route path="/compare" element={<Navigate to="/" replace />} />
              <Route path="/favorites" element={<Suspense fallback={<PageLoader />}><Favorites /></Suspense>} />
              <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
              <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={<PageLoader />}><Admin /></Suspense>} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
      </AuthModalProvider>
      </RegionProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}
