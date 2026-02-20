import CommentService from '../services/CommentService.js';

class CommentController {
  /**
   * Get comments for article
   */
  async getArticleComments(req, res, next) {
    try {
      const { articleId } = req.params;
      const { page, limit } = req.query;

      const result = await CommentService.getArticleComments(articleId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        approvedOnly: true
      });

      return res.status(200).json({
        success: true,
        message: 'Comments retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create comment
   */
  async createComment(req, res, next) {
    try {
      const { articleId } = req.params;
      const comment = await CommentService.createComment(
        articleId,
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update comment
   */
  async updateComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const comment = await CommentService.updateComment(
        commentId,
        req.user.id,
        req.body,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      await CommentService.deleteComment(commentId, req.user.id, req.user.role);

      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve comment (Admin only)
   */
  async approveComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const comment = await CommentService.approveComment(commentId);

      return res.status(200).json({
        success: true,
        message: 'Comment approved successfully',
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending comments
   */
  async getPendingComments(req, res, next) {
    try {
      const { page, limit } = req.query;

      const result = await CommentService.getPendingComments({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      });

      return res.status(200).json({
        success: true,
        message: 'Pending comments retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
