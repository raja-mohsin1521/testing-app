const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "yourSecretKey";

// Generate a JWT token for the user
const generateToken = (user) => {
  console.log('Generating token for user:', user); 
  return jwt.sign(
      user, 
    secretKey,
    { expiresIn: "999y" }  // You may want to adjust this expiration time
  );
};

// Verify the JWT token and extract the payload
const verifyToken = (token) => {
  try {
    // jwt.verify() will verify the token's signature and return the decoded payload
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
