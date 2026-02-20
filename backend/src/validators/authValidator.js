import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'any.required': 'Username is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
  
  firstName: Joi.string()
    .max(100)
    .optional(),
  
  lastName: Joi.string()
    .max(100)
    .optional()
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  
  password: Joi.string()
    .required()
}).unknown(false);

export const updateProfileSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(100)
    .optional(),
  
  firstName: Joi.string()
    .max(100)
    .optional(),
  
  lastName: Joi.string()
    .max(100)
    .optional()
}).unknown(false);
