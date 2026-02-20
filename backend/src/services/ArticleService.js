import { Article, Category, User } from '../models/index.js';
import { Op } from 'sequelize';
import { generateSlug } from '../utils/helpers.js';

class ArticleService {
  /**
   * Get all articles with filters and pagination
   */
  async getAllArticles(options = {}) {
    const { page = 1, limit = 10, categoryId, search, status = 'published' } = options;
    const offset = (page - 1) * limit;

    const where = { status };
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Article.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ],
      offset,
      limit,
      order: [['publishedAt', 'DESC']],
      distinct: true
    });

    return {
      articles: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get article by ID
   */
  async getArticleById(id) {
    const article = await Article.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } },
        { model: Category, as: 'category' }
      ]
    });

    if (!article) {
      throw {
        statusCode: 404,
        message: 'Article not found'
      };
    }

    // Increment view count
    await article.increment('viewCount');

    return article;
  }

  /**
   * Create article
   */
  async createArticle(authorId, articleData) {
    const { title, content, excerpt, imageUrl, categoryId, status } = articleData;

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw {
        statusCode: 404,
        message: 'Category not found'
      };
    }

    const slug = generateSlug(title);

    // Check if slug already exists
    const existingArticle = await Article.findOne({ where: { slug } });
    if (existingArticle) {
      throw {
        statusCode: 409,
        message: 'Article with similar title already exists'
      };
    }

    const article = await Article.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 500),
      imageUrl,
      authorId,
      categoryId,
      status,
      publishedAt: status === 'published' ? new Date() : null
    });

    return await Article.findByPk(article.id, {
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } },
        { model: Category, as: 'category' }
      ]
    });
  }

  /**
   * Update article
   */
  async updateArticle(id, authorId, updateData, userRole) {
    const article = await Article.findByPk(id);

    if (!article) {
      throw {
        statusCode: 404,
        message: 'Article not found'
      };
    }

    // Check authorization
    if (article.authorId !== authorId && userRole !== 'admin') {
      throw {
        statusCode: 403,
        message: 'You can only edit your own articles'
      };
    }

    const { title, content, excerpt, imageUrl, categoryId, status } = updateData;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw {
          statusCode: 404,
          message: 'Category not found'
        };
      }
    }

    // Update article
    if (title) {
      const newSlug = generateSlug(title);
      const existingArticle = await Article.findOne({
        where: { slug: newSlug, id: { [Op.ne]: id } }
      });
      if (existingArticle) {
        throw {
          statusCode: 409,
          message: 'Article with similar title already exists'
        };
      }
      article.slug = newSlug;
      article.title = title;
    }

    if (content) article.content = content;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (imageUrl !== undefined) article.imageUrl = imageUrl;
    if (categoryId) article.categoryId = categoryId;
    if (status) {
      article.status = status;
      if (status === 'published' && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    await article.save();

    return await Article.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } },
        { model: Category, as: 'category' }
      ]
    });
  }

  /**
   * Delete article
   */
  async deleteArticle(id, authorId, userRole) {
    const article = await Article.findByPk(id);

    if (!article) {
      throw {
        statusCode: 404,
        message: 'Article not found'
      };
    }

    // Check authorization
    if (article.authorId !== authorId && userRole !== 'admin') {
      throw {
        statusCode: 403,
        message: 'You can only delete your own articles'
      };
    }

    await article.destroy();
    return { message: 'Article deleted successfully' };
  }

  /**
   * Get articles by author
   */
  async getArticlesByAuthor(authorId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      where: { authorId },
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } },
        { model: Category, as: 'category' }
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    return {
      articles: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

export default new ArticleService();
