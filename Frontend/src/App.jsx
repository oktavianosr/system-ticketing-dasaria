import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import TicketListPage from './pages/TicketListPage';
import TicketCreatePage from './pages/TicketCreatePage';
import TicketDetailPage from './pages/TicketDetailPage';
import ProfilePage from './pages/ProfilePage';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/tickets" replace />} />
                <Route path="/tickets" element={<TicketListPage />} />
                <Route path="/ticket/create" element={<TicketCreatePage />} />
                <Route path="/tickets/:id" element={<TicketDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
