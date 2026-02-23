import { Comment, Article, User } from '../models/index.js';

class CommentService {
  /**
   * Get comments for article
   */
  async getArticleComments(articleId, options = {}) {
    const { page = 1, limit = 10, approvedOnly = true } = options;
    const offset = (page - 1) * limit;

    // Verify article exists
    const article = await Article.findByPk(articleId);
    if (!article) {
      throw {
        statusCode: 404,
        message: 'Article not found'
      };
    }

    const where = { articleId };
    if (approvedOnly) where.isApproved = true;

    const { count, rows } = await Comment.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'email'] }
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    return {
      comments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Create comment
   */
  async createComment(articleId, authorId, commentData) {
    // Verify article exists
    const article = await Article.findByPk(articleId);
    if (!article) {
      throw {
        statusCode: 404,
        message: 'Article not found'
      };
    }

    const { content } = commentData;

    const comment = await Comment.create({
      content,
      articleId,
      authorId,
      isApproved: false // Comments need approval by default
    });

    return await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } }
      ]
    });
  }

  /**
   * Update comment (Author or Admin)
   */
  async updateComment(id, authorId, updateData, userRole) {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      throw {
        statusCode: 404,
        message: 'Comment not found'
      };
    }

    // Check authorization
    if (comment.authorId !== authorId && userRole !== 'admin') {
      throw {
        statusCode: 403,
        message: 'You can only edit your own comments'
      };
    }

    const { content, isApproved } = updateData;

    if (content) comment.content = content;
    if (isApproved !== undefined && userRole === 'admin') {
      comment.isApproved = isApproved;
    }

    await comment.save();

    return await Comment.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } }
      ]
    });
  }

  /**
   * Delete comment (Author or Admin)
   */
  async deleteComment(id, authorId, userRole) {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      throw {
        statusCode: 404,
        message: 'Comment not found'
      };
    }

    // Check authorization
    if (comment.authorId !== authorId && userRole !== 'admin') {
      throw {
        statusCode: 403,
        message: 'You can only delete your own comments'
      };
    }

    await comment.destroy();
    return { message: 'Comment deleted successfully' };
  }

  /**
   * Approve comment (Admin only)
   */
  async approveComment(id) {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      throw {
        statusCode: 404,
        message: 'Comment not found'
      };
    }

    comment.isApproved = true;
    await comment.save();

    return comment;
  }

  /**
   * Get pending comments (Admin only)
   */
  async getPendingComments(options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await Comment.findAndCountAll({
      where: { isApproved: false },
      include: [
        { model: User, as: 'author', attributes: { exclude: ['password'] } },
        { model: Article, as: 'article', attributes: ['id', 'title', 'slug'] }
      ],
      offset,
      limit,
      order: [['createdAt', 'ASC']],
      distinct: true
    });

    return {
      comments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

export default new CommentService();
