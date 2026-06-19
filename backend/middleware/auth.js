const jwt = require("jsonwebtoken");
// Fallback JWT secret in case .env is missing
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_please_change";

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
