import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const canWrite = user?.role === 'editor' || user?.role === 'admin';

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/news" className="nav-brand">
          <span className="brand-icon">📰</span>
          <span className="brand-name">NewsPortal</span>
        </Link>

        <nav className="nav-actions">
          {canWrite && (
            <Link to="/create" className="btn btn-primary btn-sm">
              + New Article
            </Link>
          )}
          <div className="nav-user">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm logout-btn">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
