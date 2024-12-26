const dotenv = require("dotenv");
require("dotenv").config();
const {
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  transposeCipher,
  padPassword,
  reverseTransposeCipher
} = require("./ciphers/cipherUtils");

const test = () => {
  const userId = "676a89371cccdf7a8d099e4a";
  const substitutionAlphabet = process.env.SUBSTITUTION_ALPHABET;
  const vigenereKey = process.env.VIGENERE_KEY;
  const keyPattern = process.env.TRANSPOSITION_KEY;

  console.log(`${keyPattern}`, keyPattern.length);
  
  // Step 1: Transposition
  const transposed = transposeCipher(userId, keyPattern);
  console.log("Transposed:", transposed);

  // Step 2: Monoalphabetic Encryption
  const monoEncrypted = monoalphabeticEncrypt(transposed, substitutionAlphabet);
  console.log("Mono Encrypted:", monoEncrypted);

  // Step 3: Vigenère Encryption
  const vigenereEncrypted = vigenereEncrypt(monoEncrypted, vigenereKey);
  console.log("Vigenère Encrypted:", vigenereEncrypted);

  // Step 4: Vigenère Decryption
  const vigenereDecrypted = vigenereDecrypt(vigenereEncrypted, vigenereKey);
  console.log("Vigenère Decrypted:", vigenereDecrypted);

  // Step 5: Monoalphabetic Decryption
  const monoDecrypted = monoalphabeticDecrypt(vigenereDecrypted, substitutionAlphabet);
  console.log("Mono Decrypted:", monoDecrypted);

  // Step 6: Reverse Transposition
  const originalPassword = reverseTransposeCipher(monoDecrypted, keyPattern);
  console.log("Original Password:", originalPassword);

  // Final Validation
  console.assert(originalPassword === userId, "Decryption failed!");
};

test();