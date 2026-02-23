/**
 * Generate slug from string
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Format error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} data - Additional data
 * @returns {Object} Formatted error response
 */
export const formatErrorResponse = (statusCode, message, data = null) => {
  return {
    success: false,
    statusCode,
    message,
    data
  };
};

/**
 * Format success response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @returns {Object} Formatted success response
 */
export const formatSuccessResponse = (statusCode, message, data = null) => {
  return {
    success: true,
    statusCode,
    message,
    data
  };
};
