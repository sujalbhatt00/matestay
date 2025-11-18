export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log full error server-side
  console.error(" Unhandled Error:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // In production hide stack traces
  const payload = { message };
  if (process.env.NODE_ENV !== "production") payload.stack = err.stack;

  res.status(status).json(payload);
}