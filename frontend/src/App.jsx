import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AthletesPage from './pages/AthletesPage'
import MeetsPage from './pages/MeetsPage'
import ResultsPage from './pages/ResultsPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="athletes" element={<AthletesPage />} />
            <Route path="meets" element={<MeetsPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin — protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
