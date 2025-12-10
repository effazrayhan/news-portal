import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function NewsForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({ title: '', body: '' });

  useEffect(() => {
    if (id) {
      api.getNewsById(id).then(res => {
        if (res.data.author_id !== currentUser.id) {
          alert("You are not authorized to edit this post.");
          navigate('/news');
        }
        setFormData({ title: res.data.title, body: res.data.body });
      });
    }
  }, [id, currentUser.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return alert("Title cannot be empty");
    if (formData.body.length < 20) return alert("Body must be at least 20 characters");

    if (id) {
      await api.updateNews(id, formData);
    } else {
      await api.createNews({
        ...formData,
        author_id: currentUser.id,
        comments: [] 
      });
    }
    navigate('/news');
  };

  return (
    <div className="container">
      <h2>{id ? 'Edit News' : 'Create News'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea 
            value={formData.body} 
            onChange={e => setFormData({...formData, body: e.target.value})} 
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
