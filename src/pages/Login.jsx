import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getUsers().then((res) => setUsers(res.data));
  }, []);

  const handleLogin = () => {
    if (!selectedUser) return alert('Please select a user');
    const user = users.find(u => u.id === parseInt(selectedUser));
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/news'); // Redirect to News List page
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
        <option value="">-- Select User --</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
