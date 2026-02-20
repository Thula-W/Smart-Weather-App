import rateLimit from "express-rate-limit";

// Limit for /api/weather: 30 requests per 10 minutes
export const weatherLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 30,
  message: { error: "Too many weather requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit for /api/chat: 20 requests per minute
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20,
  message: { error: "Too many chat requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
