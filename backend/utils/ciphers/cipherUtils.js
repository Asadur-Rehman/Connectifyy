// utils/ciphers/cipherUtils.js
require("dotenv").config();

// Pad the password to 32 characters
function padPassword(password) {
  if (password.length < 32) {
    return password.padEnd(32, " ");
  } else if (password.length > 32) {
    return password.substring(0, 32);
  }
  return password;
}

// Transpose password using key pattern from .env
function transposePassword(password, keyPattern) {
  const paddedPassword = padPassword(password);
  const columns = new Array(keyPattern.length).fill("");
  let index = 0;

  for (let i = 0; i < paddedPassword.length; i++) {
    columns[index] += paddedPassword[i];
    index = (index + 1) % keyPattern.length;
  }

  let transposedPassword = "";
  keyPattern.forEach((colIndex) => {
    transposedPassword += columns[colIndex - 1];
  });

  return transposedPassword;
}

// Apply Vigenère cipher encryption
function vigenereEncrypt(password, vigenereKey) {
  const key = vigenereKey
    .repeat(Math.ceil(password.length / vigenereKey.length))
    .slice(0, password.length);
  let encryptedPassword = "";

  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i);
    const keyCode = key.charCodeAt(i);

    if (charCode >= 32 && charCode <= 126) {
      encryptedPassword += String.fromCharCode(
        ((charCode - 32 + (keyCode - 32)) % 95) + 32
      );
    } else {
      encryptedPassword += password[i];
    }
  }

  return encryptedPassword;
}

// Decrypt Vigenère cipher
function vigenereDecrypt(encryptedPassword, vigenereKey) {
  const key = vigenereKey
    .repeat(Math.ceil(encryptedPassword.length / vigenereKey.length))
    .slice(0, encryptedPassword.length);
  let decryptedPassword = "";

  for (let i = 0; i < encryptedPassword.length; i++) {
    const charCode = encryptedPassword.charCodeAt(i);
    const keyCode = key.charCodeAt(i);

    if (charCode >= 32 && charCode <= 126) {
      decryptedPassword += String.fromCharCode(
        ((charCode - 32 - (keyCode - 32) + 95) % 95) + 32
      );
    } else {
      decryptedPassword += encryptedPassword[i];
    }
  }

  return decryptedPassword;
}

// Monoalphabetic cipher encryption
function monoalphabeticEncrypt(password, substitutionAlphabet) {
  const standardAlphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  let encryptedPassword = "";

  for (const char of password) {
    const index = standardAlphabet.indexOf(char);
    if (index !== -1) {
      encryptedPassword += substitutionAlphabet[index];
    } else {
      encryptedPassword += char; // Leave non-alphabetic characters unchanged
    }
  }

  return encryptedPassword;
}

// Monoalphabetic cipher decryption
function monoalphabeticDecrypt(encryptedPassword, substitutionAlphabet) {
  const standardAlphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  let decryptedPassword = "";

  for (const char of encryptedPassword) {
    const index = substitutionAlphabet.indexOf(char);
    if (index !== -1) {
      decryptedPassword += standardAlphabet[index];
    } else {
      decryptedPassword += char; // Leave non-alphabetic characters unchanged
    }
  }

  return decryptedPassword;
}

module.exports = {
  padPassword,
  transposePassword,
  vigenereEncrypt,
  vigenereDecrypt,
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
};
