import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { articleAPI, categoryAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function NewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    categoryId: '',
    status: 'draft',
  });

  useEffect(() => {
    categoryAPI.getAll({ limit: 100 }).then((res) => {
      const cats = res.categories || [];
      setCategories(cats);
      if (!id && cats.length > 0) {
        setForm((f) => ({ ...f, categoryId: cats[0].id }));
      }
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    articleAPI
      .getById(id)
      .then((res) => {
        const a = res;
        if (a.author?.id !== currentUser?.id && currentUser?.role !== 'admin') {
          alert('You are not authorized to edit this article.');
          navigate('/news');
          return;
        }
        setForm({
          title: a.title || '',
          content: a.content || '',
          excerpt: a.excerpt || '',
          imageUrl: a.imageUrl || '',
          categoryId: a.categoryId || '',
          status: a.status || 'draft',
        });
      })
      .catch(() => navigate('/news'))
      .finally(() => setFetching(false));
  }, [id, currentUser?.id, currentUser?.role, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.title.length < 5) return setError('Title must be at least 5 characters.');
    if (form.content.length < 50) return setError('Content must be at least 50 characters.');
    if (!form.categoryId) return setError('Please select a category.');

    setLoading(true);
    try {
      if (id) {
        await articleAPI.update(id, form);
      } else {
        await articleAPI.create(form);
      }
      navigate('/news');
    } catch (err) {
      setError(err.message || 'Failed to save article. Check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page">
        <Navbar />
        <div className="container"><div className="loading-text">Loading article…</div></div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container container-narrow">
        <div className="form-page-header">
          <Link to="/news" className="back-link">← Back to Articles</Link>
          <h1 className="page-title">{id ? 'Edit Article' : 'New Article'}</h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="article-form card">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter article title (min. 5 characters)"
              required
              minLength={5}
              maxLength={200}
            />
            <span className="field-hint">{form.title.length}/200</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">
              Excerpt <span className="optional-label">(optional, shown in card previews)</span>
            </label>
            <input
              id="excerpt"
              type="text"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short description for article preview…"
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">
              Image URL <span className="optional-label">(optional)</span>
            </label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview" className="img-preview" onError={(e) => { e.target.style.display = 'none'; }} />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">
              Content *{' '}
              <span className={`char-count ${form.content.length < 50 ? 'char-count-warn' : 'char-count-ok'}`}>
                {form.content.length} chars (min. 50)
              </span>
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your article content here…"
              rows={14}
              required
            />
          </div>

          <div className="form-actions">
            <Link to="/news" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : (id ? 'Update Article' : 'Publish Article')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
