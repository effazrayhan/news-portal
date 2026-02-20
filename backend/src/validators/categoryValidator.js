import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Category name must be at least 3 characters long',
      'string.max': 'Category name cannot exceed 100 characters',
      'any.required': 'Category name is required'
    }),
  
  description: Joi.string()
    .optional(),
  
  isActive: Joi.boolean()
    .default(true)
}).unknown(false);

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .optional(),
  
  description: Joi.string()
    .optional(),
  
  isActive: Joi.boolean()
    .optional()
}).unknown(false);
