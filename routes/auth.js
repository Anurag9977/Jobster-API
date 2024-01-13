const express = require("express");
const { login, register, updateUser } = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
const testUserMiddleware = require("../middlewares/testUser");
const { default: rateLimit } = require("express-rate-limit");
const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    msg: "Too many requests. Please retry after 15 minutes",
  },
});

router.post("/login", apiLimiter, login);
router.post("/register", apiLimiter, register);
router.patch("/updateUser", authMiddleware, testUserMiddleware, updateUser);

module.exports = router;
