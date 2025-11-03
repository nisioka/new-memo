import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MemoEditPage from './pages/MemoEditPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
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
    </Routes>
  );
}

export default App;