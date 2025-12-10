import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function NewsDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.getNewsById(id).then(res => setPost(res.data));
    api.getUsers().then(res => setUsers(res.data));
  }, [id]);

  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown';

  const handleAddComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty");

    const commentObject = {
      id: Date.now(), // Simple ID generation
      text: newComment,
      user_id: currentUser.id,
      timestamp: new Date().toISOString()
    };


    const updatedComments = [...post.comments, commentObject];
    
    await api.updateNews(id, { comments: updatedComments });
    
    setPost({ ...post, comments: updatedComments });
    setNewComment('');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <p><strong>Author:</strong> {getUserName(post.author_id)}</p>
      <p>{post.body}</p>
      
      <hr />
      <h3>Comments</h3>
      <ul>
        {post.comments.map(c => (
          <li key={c.id}>
            <strong>{getUserName(c.user_id)}:</strong> {c.text}
            <br /><small>{c.timestamp}</small>
          </li>
        ))}
      </ul>

      <div className="comment-box">
        <textarea 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>
    </div>
  );
}
