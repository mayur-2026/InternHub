import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'

// Pages
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { InternshipsPage } from './pages/InternshipsPage'
import { LearningPage } from './pages/LearningPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProgressPage } from './pages/ProgressPage'
import { FeedbackPage } from './pages/FeedbackPage'
import { SupportPage } from './pages/SupportPage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Dashboard & Management Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="internships" element={<InternshipsPage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
