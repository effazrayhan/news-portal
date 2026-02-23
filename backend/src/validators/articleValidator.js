import Joi from 'joi';

export const createArticleSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  content: Joi.string()
    .min(50)
    .max(50000)
    .required()
    .messages({
      'string.min': 'Content must be at least 50 characters long',
      'string.max': 'Content cannot exceed 50000 characters',
      'any.required': 'Content is required'
    }),
  
  excerpt: Joi.string()
    .max(500)
    .allow('')
    .optional(),
  
  imageUrl: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().empty('')
  ).optional(),
  
  categoryId: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'Category ID is required'
    }),
  
  status: Joi.string()
    .valid('draft', 'published', 'archived')
    .default('draft')
}).unknown(false);

export const updateArticleSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .optional(),
  
  content: Joi.string()
    .min(50)
    .max(50000)
    .optional(),
  
  excerpt: Joi.string()
    .max(500)
    .allow('')
    .optional(),
  
  imageUrl: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().empty('')
  ).optional(),
  
  categoryId: Joi.string()
    .uuid()
    .optional(),
  
  status: Joi.string()
    .valid('draft', 'published', 'archived')
    .optional()
}).unknown(false);
