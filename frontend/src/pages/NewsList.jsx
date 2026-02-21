import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI, categoryAPI } from '../services/api';
import Navbar from '../components/Navbar';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function NewsList() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;
      const res = await articleAPI.getAll(params);
      setArticles(res.articles || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    categoryAPI.getAll({ limit: 100 }).then((res) => setCategories(res.categories || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchArticles(1), 300);
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      await articleAPI.delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete article.');
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Latest News</h1>
            <p className="page-subtitle">Stay up to date with the latest stories</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <input
            className="search-input"
            type="search"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search articles"
          />
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="articles-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line w-1/3" />
                  <div className="skeleton-line w-3/4" />
                  <div className="skeleton-line w-full" />
                  <div className="skeleton-line w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <p className="empty-text">No articles found.</p>
            {search && (
              <button className="btn btn-ghost" onClick={() => setSearch('')}>
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="article-card-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="article-card-placeholder">
                    <span>📰</span>
                  </div>
                )}
                <div className="article-card-body">
                  <div className="article-meta">
                    {article.category && (
                      <span className="category-badge">{article.category.name}</span>
                    )}
                    <span className="meta-date">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>
                  <h2 className="article-card-title">
                    <Link to={`/news/${article.id}`}>{article.title}</Link>
                  </h2>
                  <p className="article-card-excerpt">
                    {article.excerpt || article.content?.substring(0, 140)}…
                  </p>
                  <div className="article-card-footer">
                    <span className="article-author">
                      By <strong>{article.author?.username || 'Unknown'}</strong>
                    </span>
                    <div className="article-card-actions">
                      <Link to={`/news/${article.id}`} className="btn btn-ghost btn-xs">
                        Read →
                      </Link>
                      {(currentUser?.id === article.author?.id ||
                        currentUser?.role === 'admin') && (
                        <>
                          <Link to={`/edit/${article.id}`} className="btn btn-outline btn-xs">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="btn btn-danger btn-xs"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => fetchArticles(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              ← Prev
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => fetchArticles(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
