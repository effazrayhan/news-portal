import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleAPI, commentAPI } from '../services/api';
import Navbar from '../components/Navbar';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, commentRes] = await Promise.all([
          articleAPI.getById(id),
          commentAPI.getByArticle(id),
        ]);
        setArticle(articleRes);
        setComments(commentRes.comments || []);
      } catch {
        navigate('/news');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentError('');
    setCommenting(true);
    try {
      const res = await commentAPI.create(id, { content: newComment });
      setComments((prev) => [res, ...prev]);
      setNewComment('');
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment.');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="container">
          <div className="loading-text">Loading article…</div>
        </div>
      </div>
    );
  }

  const canEdit =
    currentUser?.id === article?.author?.id || currentUser?.role === 'admin';

  return (
    <div className="page">
      <Navbar />
      <main className="container container-narrow">
        <Link to="/news" className="back-link">← Back to Articles</Link>

        <article className="article-detail card">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="article-detail-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          <div className="article-detail-meta">
            {article.category && (
              <span className="category-badge">{article.category.name}</span>
            )}
            <span className={`status-badge status-${article.status}`}>{article.status}</span>
            <span className="meta-date">{formatDate(article.publishedAt || article.createdAt)}</span>
            <span className="meta-views">👁 {article.viewCount} views</span>
          </div>

          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-author-row">
            <div className="author-avatar lg">
              {article.author?.username?.[0]?.toUpperCase()}
            </div>
            <div className="author-details">
              <p className="author-name">{article.author?.username}</p>
              <p className="author-email">{article.author?.email}</p>
            </div>
            {canEdit && (
              <Link to={`/edit/${article.id}`} className="btn btn-outline btn-sm ml-auto">
                Edit Article
              </Link>
            )}
          </div>

          {article.excerpt && (
            <p className="article-lead">{article.excerpt}</p>
          )}

          <div className="article-content">
            {article.content?.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="comments-section card">
          <h3 className="comments-title">
            Comments{' '}
            <span className="comments-count">{comments.length}</span>
          </h3>

          {currentUser ? (
            <div className="comment-form">
              <div className="user-avatar sm">{currentUser.username?.[0]?.toUpperCase()}</div>
              <div className="comment-input-wrap">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts…"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) handleAddComment();
                  }}
                />
                {commentError && <p className="field-error">{commentError}</p>}
                <div className="comment-form-actions">
                  <span className="comment-hint">Ctrl+Enter to submit</span>
                  <button
                    onClick={handleAddComment}
                    className="btn btn-primary btn-sm"
                    disabled={commenting || !newComment.trim()}
                  >
                    {commenting ? 'Posting…' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="login-prompt">
              <Link to="/">Sign in</Link> to leave a comment.
            </p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-avatar">
                    {c.author?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong className="comment-author">{c.author?.username}</strong>
                      <span className="comment-date">{formatDate(c.createdAt)}</span>
                      {!c.isApproved && (
                        <span className="pending-badge">Pending approval</span>
                      )}
                    </div>
                    <p className="comment-text">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
