const jsonwebtoken = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

async function generateToken(_id) {
  return new Promise((resolve, reject) =>
    jsonwebtoken.sign(
      { _id },
      jwtSecret,
      { expiresIn: "7d" },
      (error, token) => {
        if (error) {
          reject({ name: error.name, message: error.message });
        }
        resolve(token);
      }
    )
  );
}

async function decodeToken(token) {
  return new Promise((resolve, reject) =>
    jsonwebtoken.verify(token, jwtSecret, (error, decoded) => {
      if (error) {
        reject({ name: error.name, message: error.message });
      }
      resolve(decoded);
    })
  );
}

module.exports = {
  generateToken,
  decodeToken,
};
