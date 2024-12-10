export default function errorHandlerMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  return res.status(statusCode).json({ message });
}
