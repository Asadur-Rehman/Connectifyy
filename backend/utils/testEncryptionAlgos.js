const {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  transposePassword,
  padPassword,
  reverseTransposePassword,
} = require("./ciphers/cipherUtils");

const testWithPadding = () => {
  const userId = "676a89371cccdf7a8d099e4a"; // Original User ID
  const substitutionAlphabet =
    "QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890 ";
  const vigenereKey = "SECRETKEY";
  const keyPattern = [3, 1, 4, 2];

  // Step 1: Pad Password
  const paddedPassword = padPassword(userId);
  console.log("Padded Password:", paddedPassword);

  // Step 2: Transposition
  const transposed = transposePassword(paddedPassword, keyPattern);
  console.log("Transposed:", transposed);

  // Step 3: Monoalphabetic Encryption
  const monoEncrypted = monoalphabeticEncrypt(transposed, substitutionAlphabet);
  console.log("Mono Encrypted:", monoEncrypted);

  // Step 4: Vigenère Encryption
  const vigenereEncrypted = vigenereEncrypt(monoEncrypted, vigenereKey);
  console.log("Vigenère Encrypted:", vigenereEncrypted);

  // Step 5: Vigenère Decryption
  const vigenereDecrypted = vigenereDecrypt(vigenereEncrypted, vigenereKey);
  console.log("Vigenère Decrypted:", vigenereDecrypted);

  // Step 6: Monoalphabetic Decryption
  const monoDecrypted = monoalphabeticDecrypt(vigenereDecrypted, substitutionAlphabet);
  console.log("Mono Decrypted:", monoDecrypted);

  // Step 7: Reverse Transposition
  const reversedTransposed = reverseTransposePassword(monoDecrypted, keyPattern);
  console.log("Reversed Transposed:", reversedTransposed);

  // Step 8: Trim Padding
  const originalPassword = reversedTransposed.trim();
  console.log("Original Password:", originalPassword);

  // Final Validation
  console.assert(originalPassword === userId, "Decryption failed!");
};

testWithPadding();
