import express from 'express';
import ArticleController from '../controllers/ArticleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createArticleSchema, updateArticleSchema } from '../validators/articleValidator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/articles
 * @desc    Get all published articles with filters
 * @access  Public
 */
router.get('/', ArticleController.getAllArticles);

/**
 * @route   GET /api/v1/articles/:id
 * @desc    Get article by ID
 * @access  Public
 */
router.get('/:id', ArticleController.getArticleById);

/**
 * @route   POST /api/v1/articles
 * @desc    Create new article
 * @access  Private (Editor/Admin)
 */
router.post(
  '/',
  authenticate,
  authorize(['editor', 'admin']),
  validateRequest(createArticleSchema),
  ArticleController.createArticle
);

/**
 * @route   PUT /api/v1/articles/:id
 * @desc    Update article
 * @access  Private (Article Author/Admin)
 */
router.put(
  '/:id',
  authenticate,
  validateRequest(updateArticleSchema),
  ArticleController.updateArticle
);

/**
 * @route   DELETE /api/v1/articles/:id
 * @desc    Delete article
 * @access  Private (Article Author/Admin)
 */
router.delete('/:id', authenticate, ArticleController.deleteArticle);

/**
 * @route   GET /api/v1/articles/author/:authorId
 * @desc    Get articles by specific author
 * @access  Public
 */
router.get('/author/:authorId', ArticleController.getArticlesByAuthor);

export default router;
