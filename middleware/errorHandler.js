/**
 * Global error handling middleware for consistent error responses
 * Categorizes different types of errors and formats responses accordingly
 */

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  // Default error details
  let statusCode = 500;
  let errorMessage = 'Internal server error';
  let errorDetails = {};

  // Handle validation errors (Joi)
  if (err.isJoi) {
    statusCode = 400;
    errorMessage = 'Validation error';
    errorDetails = {
      details: err.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
      }))
    };
  }
  
  // Handle missing fields errors
  else if (err.name === 'MissingFieldsError') {
    statusCode = 400;
    errorMessage = err.message || 'Missing required fields';
    errorDetails = { missing_fields: err.fields };
  }
  
  // Handle database errors
  else if (err.code && err.code.startsWith('ER_')) {
    statusCode = 500;
    errorMessage = 'Database error';
    // Don't expose internal DB errors to client in production
    errorDetails = process.env.NODE_ENV === 'production' 
      ? { message: 'A database error occurred' }
      : { message: err.message, code: err.code };
  }
  
  // Handle authentication errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = 'Authentication error';
    errorDetails = { message: 'Invalid or expired token' };
  }
  
  // Handle authorization errors
  else if (err.name === 'UnauthorizedError') {
    statusCode = 403;
    errorMessage = 'Forbidden';
    errorDetails = { message: err.message || 'Insufficient permissions' };
  }

  // Handle not found errors
  else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = err.message || 'Resource not found';
  }

  // Send the error response
  res.status(statusCode).json({
    error: errorMessage,
    ...errorDetails
  });
};

// Custom error classes
class MissingFieldsError extends Error {
  constructor(fields) {
    super('Missing required fields');
    this.name = 'MissingFieldsError';
    this.fields = fields;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message || 'Resource not found');
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message || 'Insufficient permissions');
    this.name = 'UnauthorizedError';
  }
}

module.exports = {
  errorHandler,
  MissingFieldsError,
  NotFoundError,
  UnauthorizedError
};
