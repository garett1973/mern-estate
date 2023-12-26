export const errorHandler = (success, statusCode, message) => {
  const error = new Error();
  error.success = success;
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
