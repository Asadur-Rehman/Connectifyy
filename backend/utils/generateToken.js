require("dotenv").config();
const {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  transposePassword,
  padPassword,
} = require("./ciphers/cipherUtils");

const substitutionAlphabet =
  "QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890 ";
const keyPattern = [3, 1, 4, 2]; // Example key pattern for transposition
const vigenereKey = "SECRETKEY"; // Example Vigenère key

// Generate a secure token (replaces previous JWT-based token generation)
const generatetoken = (id) => {
  const password = id.toString(); // Convert ID to string to use as input
  const paddedPassword = padPassword(password);
  const transposedPassword = transposePassword(paddedPassword, keyPattern);
  const monoEncrypted = monoalphabeticEncrypt(
    transposedPassword,
    substitutionAlphabet
  );
  const vigenereEncrypted = vigenereEncrypt(monoEncrypted, vigenereKey);

  const metadata = `${id}|${Date.now() + 30 * 24 * 60 * 60 * 1000}`; // Add expiration timestamp
  const token = `${vigenereEncrypted}|${metadata}`;
  return token;
};

// Validate and decrypt the token (can be used for token validation elsewhere)
const validatetoken = (token) => {
  const [encryptedPassword, metadata] = token.split("|");
  const [userId, expiration] = metadata.split("|");

  if (Date.now() > parseInt(expiration, 10)) {
    throw new Error("Token has expired");
  }

  const vigenereDecrypted = vigenereDecrypt(encryptedPassword, vigenereKey);
  const monoDecrypted = monoalphabeticDecrypt(
    vigenereDecrypted,
    substitutionAlphabet
  );
  const originalPassword = transposePassword(
    monoDecrypted,
    keyPattern.reverse()
  ); // Reverse transposition

  return { userId, originalPassword };
};

const token = { generatetoken, validatetoken };

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
