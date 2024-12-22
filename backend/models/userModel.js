require("dotenv").config(); // Make sure you have dotenv set up

// Pad the password to 32 characters
function padPassword(password) {
  if (password.length < 32) {
    // Pad with spaces if the password is shorter than 32 characters
    return password.padEnd(32, " ");
  } else if (password.length > 32) {
    // Truncate if it's longer than 32 characters
    return password.substring(0, 32);
  }
  return password;
}

// Transpose password using key pattern from .env
function transposePassword(password, keyPattern) {
  // Pad the password to 32 characters
  const paddedPassword = padPassword(password);

  // Split password into 8 columns based on the length of the key pattern
  const columns = new Array(keyPattern.length).fill("");
  let index = 0;

  for (let i = 0; i < paddedPassword.length; i++) {
    columns[index] += paddedPassword[i];
    index = (index + 1) % keyPattern.length;
  }

  // Reorder the columns according to the key pattern
  let transposedPassword = "";
  keyPattern.forEach((colIndex) => {
    transposedPassword += columns[colIndex - 1]; // keyPattern is 1-based, adjust for 0-based index
  });

  return transposedPassword;
}

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

userSchema.methods.matchPassword = async function (enteredPassword) {
  const keyPattern = process.env.TRANSPOSITION_KEY.split(" ").map(Number); // Convert the key pattern to an array of integers
  const transposedPassword = transposePassword(enteredPassword, keyPattern); // Apply the transposition
  return await bcrypt.compare(transposedPassword, this.password); // Compare with the hashed password
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  // Get the key pattern from .env
  const keyPattern = process.env.TRANSPOSITION_KEY.split(" ").map(Number); // Convert the key pattern to an array of integers

  // Apply the transposition cipher
  const transposedPassword = transposePassword(this.password, keyPattern);

  // Hash the transposed password
  this.password = await bcrypt.hash(transposedPassword, 10);
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
