const { customHash, compareHash } = require('./integrity'); // Assuming the code is in a file named customHashModule.js

// Inputs
const message = "Hello, this is a test message!";
const userId = "User123";
const SECRET_KEY = "SuperSecretKey!@#";

// Step 1: Generate the custom hash
const generatedHash = customHash(message, userId, SECRET_KEY);
console.log("Generated Hash:", generatedHash);

// Step 2: Verify the hash using compareHash
const isHashValid = compareHash(message, userId, generatedHash, SECRET_KEY);
console.log("Is the hash valid?", isHashValid);

// Step 3: Test with tampered message
const tamperedMessage = "Hello, this is a test message!";
const isTamperedHashValid = compareHash(tamperedMessage, userId, generatedHash, SECRET_KEY);
console.log("Is the tampered hash valid?", isTamperedHashValid);

