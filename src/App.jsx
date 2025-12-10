import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import NewsList from './pages/NewsList';
import NewsForm from './pages/NewsForm';
import NewsDetail from './pages/NewsDetail';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/news" element={<ProtectedRoute><NewsList /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
        <Route path="/news/:id" element={<ProtectedRoute><NewsDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
