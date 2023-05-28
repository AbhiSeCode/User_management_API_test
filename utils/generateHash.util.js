const { createHmac } = require("node:crypto");

function generateHash(password) {
  const secret = process.env.PASSWORD_SECRET || "password_secret";
  const hash = createHmac("sha256", secret).update(password).digest("hex");
  return hash;
}

module.exports = generateHash;
