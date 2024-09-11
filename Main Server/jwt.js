const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "yourSecretKey";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    secretKey,
    { expiresIn: "999y" }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
