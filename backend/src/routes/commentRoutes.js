import express from 'express';
import CommentController from '../controllers/CommentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createCommentSchema, updateCommentSchema } from '../validators/commentValidator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/articles/:articleId/comments
 * @desc    Get all approved comments for article
 * @access  Public
 */
router.get('/article/:articleId', CommentController.getArticleComments);

/**
 * @route   POST /api/v1/articles/:articleId/comments
 * @desc    Create comment on article
 * @access  Private
 */
router.post(
  '/article/:articleId',
  authenticate,
  validateRequest(createCommentSchema),
  CommentController.createComment
);

/**
 * @route   PUT /api/v1/comments/:commentId
 * @desc    Update comment
 * @access  Private (Comment Author/Admin)
 */
router.put(
  '/:commentId',
  authenticate,
  validateRequest(updateCommentSchema),
  CommentController.updateComment
);

/**
 * @route   DELETE /api/v1/comments/:commentId
 * @desc    Delete comment
 * @access  Private (Comment Author/Admin)
 */
router.delete('/:commentId', authenticate, CommentController.deleteComment);

/**
 * @route   POST /api/v1/comments/:commentId/approve
 * @desc    Approve comment
 * @access  Private (Admin only)
 */
router.post(
  '/:commentId/approve',
  authenticate,
  authorize(['admin']),
  CommentController.approveComment
);

/**
 * @route   GET /api/v1/comments/pending
 * @desc    Get pending comments for approval
 * @access  Private (Admin only)
 */
router.get(
  '/pending/all',
  authenticate,
  authorize(['admin']),
  CommentController.getPendingComments
);

export default router;
