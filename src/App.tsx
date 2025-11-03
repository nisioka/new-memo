import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import ErrorNotification from './components/ErrorNotification';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MemoEditPage = lazy(() => import('./pages/MemoEditPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
    </>
  );
}

export default App;