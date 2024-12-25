require("dotenv").config();
const {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  transposePassword,
  padPassword,
  reverseTransposePassword
} = require("./ciphers/cipherUtils");

const substitutionAlphabet =
  "QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890 ";
const keyPattern = [3, 1, 4, 2]; // Example key pattern for transposition
const vigenereKey = "SECRETKEY"; // Example Vigenère key

// Generate a secure token (replaces previous JWT-based token generation)
const generateToken = (id) => {
  const userId = id.toString(); // Convert ID to string to use as input
  const paddedUserId = padPassword(userId);
  const transposedUserId = transposePassword(paddedUserId, keyPattern);
  const monoEncryptedUserId = monoalphabeticEncrypt(
    transposedUserId,
    substitutionAlphabet
  );
  const vigenereEncryptedUserId = vigenereEncrypt(monoEncryptedUserId, vigenereKey);

  const metadata = `${Date.now() + 30 * 24 * 60 * 60 * 1000}`; // Add expiration timestamp
  const token = `${vigenereEncryptedUserId}|${metadata}`;
  return token;
};

// Validate and decrypt the token (can be used for token validation elsewhere)
const validateToken = (token) => {
  const [encryptedId, expiration] = token.split("|");

  if (Date.now() > parseInt(expiration, 10)) {
    throw new Error("Token has expired");
  }

  const vigenereDecrypted = vigenereDecrypt(encryptedId, vigenereKey);
  const monoDecrypted = monoalphabeticDecrypt(
    vigenereDecrypted,
    substitutionAlphabet
  );
  const userId = reverseTransposePassword(
    monoDecrypted,
    keyPattern
  ); // Reverse transposition

  return { userId };
};

module.exports = { generateToken, validateToken };
