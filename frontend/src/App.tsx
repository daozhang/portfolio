
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
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
  PublicPortfolioPage
} from './pages'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <AppContainer>
        <Routes>
          {/* Public routes - no layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/p/:portfolioId" element={<PublicPortfolioPage />} />
          
          {/* Protected routes with layout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio/:id/edit" 
            element={
              <ProtectedRoute>
                <Layout showBreadcrumb={false}>
                  <PortfolioEditPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio/:id/preview" 
            element={
              <ProtectedRoute>
                <Layout showBreadcrumb={false}>
                  <PortfolioPreviewPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin-only routes with layout */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AdminPanelPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/invites" 
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AdminInvitesPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AdminUsersPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
        </AppContainer>
      </AuthProvider>
    </DndProvider>
  )
}

export default App