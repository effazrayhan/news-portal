import Joi from 'joi';

export const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.max': 'Comment cannot exceed 5000 characters',
      'any.required': 'Comment content is required'
    })
}).unknown(false);

export const updateCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(5000)
    .optional()
    .messages({
      'string.max': 'Comment cannot exceed 5000 characters'
    }),
  
  isApproved: Joi.boolean()
    .optional()
}).unknown(false);
