const jwt = require("jsonwebtoken");
const User = require("../Models/usermodel");

exports.protect = (req, res, next) => {
  const token = req.header("Authorization") || req.cookies.login_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    let user = await User.findById(data.userId);
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};
