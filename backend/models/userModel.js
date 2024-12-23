require("dotenv").config(); // Make sure you have dotenv set up

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

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  const keyPattern = process.env.TRANSPOSITION_KEY.split(" ").map(Number);
  const vigenereKey = process.env.VIGENERE_KEY;
  const substitutionAlphabet = process.env.SUBSTITUTION_ALPHABET;

  // Apply transposition cipher
  let transformedPassword = transposePassword(enteredPassword, keyPattern);

  // Apply Vigenère cipher
  transformedPassword = vigenereEncrypt(transformedPassword, vigenereKey);

  // Apply Monoalphabetic cipher
  transformedPassword = monoalphabeticEncrypt(
    transformedPassword,
    substitutionAlphabet
  );

  // Compare with the stored password
  return transformedPassword === this.password;
};

// Encrypt password during registration
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const keyPattern = process.env.TRANSPOSITION_KEY.split(" ").map(Number);
  const vigenereKey = process.env.VIGENERE_KEY;
  const substitutionAlphabet = process.env.SUBSTITUTION_ALPHABET;

  // Apply transposition cipher
  let transformedPassword = transposePassword(this.password, keyPattern);

  // Apply Vigenère cipher
  transformedPassword = vigenereEncrypt(transformedPassword, vigenereKey);

  // Apply Monoalphabetic cipher
  transformedPassword = monoalphabeticEncrypt(
    transformedPassword,
    substitutionAlphabet
  );

  this.password = transformedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// // const mongoose = require("mongoose");
// // const bcrypt = require("bcrypt");

// // const userSchema = mongoose.Schema(
// //   {
// //     name: { type: "String", required: true },
// //     email: { type: "String", unique: true, required: true },
// //     password: { type: "String", required: true },
// //     pic: {
// //       type: "String",
// //       required: true,
// //       default:
// //         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
// //     },
// //     isAdmin: {
// //       type: Boolean,
// //       required: true,
// //       default: false,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // userSchema.methods.matchPassword = async function (enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // userSchema.pre("save", async function (next) {
// //   if (!this.isModified) {
// //     next();
// //   }
// //   this.password = await bcrypt.hash(this.password, 10);
// // });

// // const User = mongoose.model("User", userSchema);

// // module.exports = User;
