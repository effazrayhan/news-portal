import express from 'express';
import CategoryController from '../controllers/CategoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

const router = express.Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID with articles
 * @access  Public
 */
router.get('/:id', CategoryController.getCategoryById);

/**
 * @route   POST /api/v1/categories
 * @desc    Create new category
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  validateRequest(createCategorySchema),
  CategoryController.createCategory
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update category
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validateRequest(updateCategorySchema),
  CategoryController.updateCategory
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize(['admin']), CategoryController.deleteCategory);

export default router;
