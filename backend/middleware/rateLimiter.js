import rateLimit from "express-rate-limit";

// ============ RATE LIMITERS ============

// General limiter for all endpoints
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later." },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/" && req.method === "GET";
  },
});

// Auth limiter - Stricter for login/register attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later." },
  skipSuccessfulRequests: false, // Count all requests, even successful ones
});

// Forgot password limiter - Prevent abuse
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset requests, please try again later." },
});

// Create/Update limiter - Moderate protection
export const createUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 create/update requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Search limiter - Prevent aggressive scraping
export const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 search requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Search limit exceeded, please try again later." },
});

// Payment limiter - Strict for payment endpoints
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 payment requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many payment requests, please try again later." },
});


