/**
 * Validation middleware using Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {string} dataSource - Where to get data (body, query, params)
 */
export const validateRequest = (schema, dataSource = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[dataSource], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req[dataSource] = value;
    next();
  };
};
