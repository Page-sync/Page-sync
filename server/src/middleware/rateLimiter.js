const rateLimit = require("express-rate-limit");

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many requests from this IP. Try again later",
});
const noteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP. Try again later",
});

module.exports = { strictLimiter, noteLimiter };
