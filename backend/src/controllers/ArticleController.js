import ArticleService from '../services/ArticleService.js';

class ArticleController {
  /**
   * Get all articles
   */
  async getAllArticles(req, res, next) {
    try {
      const { page, limit, categoryId, search, status } = req.query;
      const result = await ArticleService.getAllArticles({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        categoryId,
        search,
        status: status || 'published'
      });

      return res.status(200).json({
        success: true,
        message: 'Articles retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get article by ID
   */
  async getArticleById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await ArticleService.getArticleById(id);

      return res.status(200).json({
        success: true,
        message: 'Article retrieved successfully',
        data: article
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create article
   */
  async createArticle(req, res, next) {
    try {
      const article = await ArticleService.createArticle(req.user.id, req.body);

      return res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: article
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update article
   */
  async updateArticle(req, res, next) {
    try {
      const { id } = req.params;
      const article = await ArticleService.updateArticle(
        id,
        req.user.id,
        req.body,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        data: article
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete article
   */
  async deleteArticle(req, res, next) {
    try {
      const { id } = req.params;
      await ArticleService.deleteArticle(id, req.user.id, req.user.role);

      return res.status(200).json({
        success: true,
        message: 'Article deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get articles by author
   */
  async getArticlesByAuthor(req, res, next) {
    try {
      const { authorId } = req.params;
      const { page, limit } = req.query;

      const result = await ArticleService.getArticlesByAuthor(authorId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      });

      return res.status(200).json({
        success: true,
        message: 'Articles retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ArticleController();
