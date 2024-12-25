const mongoose = require("mongoose");
const {
  transposePassword,
  vigenereEncrypt,
  monoalphabeticEncrypt,
} = require("../utils/ciphers/cipherUtils");

require("dotenv").config();

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

  let transformedPassword = transposePassword(enteredPassword, keyPattern);
  transformedPassword = vigenereEncrypt(transformedPassword, vigenereKey);
  transformedPassword = monoalphabeticEncrypt(
    transformedPassword,
    substitutionAlphabet
  );

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

  let transformedPassword = transposePassword(this.password, keyPattern);
  transformedPassword = vigenereEncrypt(transformedPassword, vigenereKey);
  transformedPassword = monoalphabeticEncrypt(
    transformedPassword,
    substitutionAlphabet
  );

  this.password = transformedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
