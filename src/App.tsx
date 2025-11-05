import { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import ErrorNotification from './components/ErrorNotification';
import OfflineIndicator from './components/OfflineIndicator';
import { authService } from './services/authService';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MemoEditPage from './pages/MemoEditPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    authService.initAuth();
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route 
            path="/edit/:memoId" 
            element={isAuthenticated ? <MemoEditPage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/history" 
            element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
      <ErrorNotification />
      <OfflineIndicator />
    </>
  );
}

export default App;