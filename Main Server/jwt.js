const jwt = require("jsonwebtoken");

// Use a secret key from environment variables or fallback to a default value
const secretKey = process.env.JWT_SECRET || "yourSecretKey";

// Function to generate a JWT token for the user
const generateToken = (user) => {
  // Log the user object to debug the input
  console.log("Generating token for user:", user);

  const payload = {
    teacher_id: user.teacher_id, // Ensure user.id exists
    email: user.email,
  };

  // Sign the token without expiration
  const token = jwt.sign(payload, secretKey);
  console.log("Generated Token:", token); // Log the token for debugging
  return token;
};

// Function to verify a JWT token and extract the payload
const verifyToken = (token) => {
  try {
    console.log("Verifying token:", token); // Log the token for debugging
    // jwt.verify() verifies the token and returns the decoded payload
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded Payload:", decoded); // Log the decoded payload
    return decoded;
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("An error occurred during token verification");
    }
  }
};

// Example usage (for testing purposes only)
if (require.main === module) {
  const testUser = {
    id: 123, // Ensure this field is present
    email: "john12@example.comm",
  };

  // Generate and verify a token
  try {
    const token = generateToken(testUser);
    const decoded = verifyToken(token);
    console.log("Verified Payload:", decoded);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
