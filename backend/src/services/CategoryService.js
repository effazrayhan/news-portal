import { Category, Article } from '../models/index.js';
import { generateSlug } from '../utils/helpers.js';
import { Op } from 'sequelize';

class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories(options = {}) {
    const { page = 1, limit = 10, includeInactive = false } = options;
    const offset = (page - 1) * limit;

    const where = includeInactive ? {} : { isActive: true };

    const { count, rows } = await Category.findAndCountAll({
      where,
      offset,
      limit,
      order: [['name', 'ASC']],
      distinct: true
    });

    return {
      categories: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id) {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Article,
          as: 'articles',
          attributes: ['id', 'title', 'slug'],
          where: { status: 'published' },
          required: false
        }
      ]
    });

    if (!category) {
      throw {
        statusCode: 404,
        message: 'Category not found'
      };
    }

    return category;
  }

  /**
   * Create category (Admin only)
   */
  async createCategory(categoryData) {
    const { name, description } = categoryData;

    const slug = generateSlug(name);

    // Check if category exists
    const existingCategory = await Category.findOne({
      where: { slug }
    });

    if (existingCategory) {
      throw {
        statusCode: 409,
        message: 'Category already exists'
      };
    }

    return await Category.create({
      name,
      slug,
      description: description || null,
      isActive: true
    });
  }

  /**
   * Update category (Admin only)
   */
  async updateCategory(id, updateData) {
    const category = await Category.findByPk(id);

    if (!category) {
      throw {
        statusCode: 404,
        message: 'Category not found'
      };
    }

    const { name, description, isActive } = updateData;

    if (name && name !== category.name) {
      const slug = generateSlug(name);
      const existingCategory = await Category.findOne({
        where: { slug, id: { [Op.ne]: id } }
      });

      if (existingCategory) {
        throw {
          statusCode: 409,
          message: 'Category with this name already exists'
        };
      }

      category.name = name;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return category;
  }

  /**
   * Delete category (Admin only)
   */
  async deleteCategory(id) {
    const category = await Category.findByPk(id);

    if (!category) {
      throw {
        statusCode: 404,
        message: 'Category not found'
      };
    }

    // Check if category has articles
    const articleCount = await Article.count({ where: { categoryId: id } });
    if (articleCount > 0) {
      throw {
        statusCode: 409,
        message: 'Cannot delete category with articles'
      };
    }

    await category.destroy();
    return { message: 'Category deleted successfully' };
  }
}

export default new CategoryService();
