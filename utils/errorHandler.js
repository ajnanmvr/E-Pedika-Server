const dotenv = require("dotenv");
dotenv.config();

const handleModelValidationError = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    // Handling Mongoose Validation Errors
    const errors = {};
    for (const field in err.errors) {
      const errorMessage =
        process.env.NODE_ENV === "production"
          ? `${field} is required`
          : err.errors[field].message;
      errors[field] = errorMessage;
    }
    res
      .status(422)
      .json({ status: "error", message: "Validation error occurred", errors });
    return true;
  }
  return next(err);
};

const handleDuplicateKeyError = (err, res, next) => {
  if (err.code === 11000) {
    // Handling Mongoose Duplicate Key Error
    const fieldName = Object.keys(err.keyValue)[0];
    const message = `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } is already in use`;
    res.status(409).json({ status: "error", message });
    return true;
  }
  return next(err);
};

const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (
    !handleModelValidationError(err, req, res, next) &&
    !handleDuplicateKeyError(err, res, next)
  ) {
    // Handle other errors if needed
    if (process.env.NODE_ENV === "production") {
      res.status(status).json({ status: "error", message });
    } else {
      console.log('dev');
      res.status(status).json({ status: "error", message, stack: err.stack });
    }
  }
};

module.exports = errorHandler;
