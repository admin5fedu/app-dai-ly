import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './lib/utils/error-boundary'
import { ThemeProvider } from './lib/theme-context'
import { MainLayout } from './components/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { LoadingFallback } from './components/LoadingFallback'
import { NetworkStatus } from './components/NetworkStatus'
import './App.css'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Scan = lazy(() => import('./pages/Scan'))

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <NetworkStatus />
          <Routes>
            {/* Login page - No layout */}
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Login />
                </Suspense>
              }
            />

            {/* Protected routes - With MainLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Home />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Scan />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Products />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <ProductDetail />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="min-h-screen px-4 py-6">
                      <div className="mx-auto max-w-md">
                        <h1 className="text-2xl font-bold mb-2">Báo cáo</h1>
                        <p className="text-muted-foreground">Trang báo cáo đang được phát triển...</p>
                      </div>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Profile />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <ChangePassword />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
