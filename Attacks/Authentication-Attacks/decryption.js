require("dotenv").config(); // Ensure dotenv is properly configured

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
function reverseTransposeCipher(transposedPassword, keyPattern) {
  const paddedLength = transposedPassword.length;
  const columns = new Array(keyPattern.length).fill("");

  // Calculate column lengths based on the key pattern
  const columnLengths = new Array(keyPattern.length).fill(
    Math.floor(paddedLength / keyPattern.length)
  );
  for (let i = 0; i < paddedLength % keyPattern.length; i++) {
    columnLengths[i]++;
  }

  // Split the transposed password into columns
  let index = 0;
  keyPattern.forEach((colIndex, i) => {
    columns[colIndex - 1] = transposedPassword.slice(
      index,
      index + columnLengths[i]
    );
    index += columnLengths[i];
  });

  // Reconstruct the original password from columns
  let originalPassword = "";
  for (let i = 0; i < Math.max(...columnLengths); i++) {
    for (const column of columns) {
      if (i < column.length) {
        originalPassword += column[i];
      }
    }
  }

  return originalPassword;
}

// Vigenère cipher decryption
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

// Attacker's decryption function
function decryptPassword(encryptedPassword) {
  const keyPattern = [3, 1, 4, 5, 2, 7, 6, 8]; // TRANSPOSITION_KEY
  const vigenereKey = "securekey"; // VIGENERE_KEY
  const substitutionAlphabet =
    "QWERTYUIOPLKJHGFDSAZXCVBNMmnbvcxzlkjhgfdsapoiuytrewq0987654321"; // SUBSTITUTION_ALPHABET

  // Step 1: Reverse Monoalphabetic Cipher
  const step1 = monoalphabeticDecrypt(encryptedPassword, substitutionAlphabet);
  console.log("After Monoalphabetic Decryption:", step1);

  // Step 2: Reverse Vigenère Cipher
  const step2 = vigenereDecrypt(step1, vigenereKey);
  console.log("After Vigenère Decryption:", step2);

  // Step 3: Reverse Transposition Cipher
  const step3 = reverseTransposeCipher(step2, keyPattern);
  console.log("After Transposition Decryption:", step3);

  return step3;
}

// Encrypted password given to the attacker
const encryptedPassword = "zcbybchcficbfochUwicCyoc[cwiPbyo";

// Decrypt the password
const decryptedPassword = decryptPassword(encryptedPassword);
console.log("Decrypted Password:", decryptedPassword);
