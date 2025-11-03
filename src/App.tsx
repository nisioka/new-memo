import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

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
    </Routes>
  );
}

export default App;