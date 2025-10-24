import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

// Pages
import {
  LandingPage,
  RegisterPage,
  DashboardPage,
  PortfolioEditPage,
  PortfolioPreviewPage,
  ProfilePage,
  AdminPanelPage,
  AdminInvitesPage,
  AdminUsersPage,
  PublicPortfolioPage,
  MediaPage
} from './pages';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/p/:portfolioId" element={<PublicPortfolioPage />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />

                <Route path="/portfolio/:id/edit" element={
                  <ProtectedRoute>
                    <PortfolioEditPage />
                  </ProtectedRoute>
                } />

                <Route path="/portfolio/:id/preview" element={
                  <ProtectedRoute>
                    <PortfolioPreviewPage />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                <Route path="/media" element={
                  <ProtectedRoute>
                    <MediaPage />
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminPanelPage />
                  </ProtectedRoute>
                } />

                <Route path="/admin/invites" element={
                  <ProtectedRoute requireAdmin>
                    <AdminInvitesPage />
                  </ProtectedRoute>
                } />

                <Route path="/admin/users" element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsersPage />
                  </ProtectedRoute>
                } />

                {/* Redirect unknown routes to dashboard or landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;