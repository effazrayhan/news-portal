import CategoryService from '../services/CategoryService.js';

class CategoryController {
  /**
   * Get all categories
   */
  async getAllCategories(req, res, next) {
    try {
      const { page, limit, includeInactive } = req.query;
      const result = await CategoryService.getAllCategories({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        includeInactive: includeInactive === 'true'
      });

      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);

      return res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create category
   */
  async createCategory(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category
   */
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.updateCategory(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id);

      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
