import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch both news and users to resolve author names
    Promise.all([api.getNews(), api.getUsers()]).then(([newsRes, usersRes]) => {
      setNews(newsRes.data);
      setUsers(usersRes.data);
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.deleteNews(id);
      setNews(news.filter(n => n.id !== id));
    }
  };

  const getAuthorName = (authorId) => {
    const author = users.find(u => u.id === authorId);
    return author ? author.name : 'Unknown';
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>News Portal</h2>
        <div>
           <span>Logged in as: <strong>{currentUser?.name}</strong></span>
           <Link to="/create" className="btn-primary" style={{marginLeft: '10px'}}>Create News</Link>
        </div>
      </header>
      
      {news.map(item => (
        <div key={item.id} className="card">
          <h3>{item.title}</h3>
          <p>By: {getAuthorName(item.author_id)}</p>
          <div className="actions">
            <Link to={`/news/${item.id}`}>View Details</Link>
            
            {/* Show Edit/Delete only if logged-in user is author */}
            {currentUser?.id === item.author_id && (
              <>
                <Link to={`/edit/${item.id}`} style={{marginLeft: '10px'}}>Edit</Link>
                <button onClick={() => handleDelete(item.id)} style={{marginLeft: '10px', color: 'red'}}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
