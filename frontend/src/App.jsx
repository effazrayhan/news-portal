import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NewsList from './pages/NewsList';
import NewsForm from './pages/NewsForm';
import NewsDetail from './pages/NewsDetail';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return token && user ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return token && user ? <Navigate to="/news" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsList /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
        <Route path="/news/:id" element={<ProtectedRoute><NewsDetail /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

