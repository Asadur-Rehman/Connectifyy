const crypto = require('crypto');

const SECRET_KEY = process.env.SECRET_KEY;
console.log(SECRET_KEY)

// Custom Bitwise Rotate Function
const bitwiseRotate = (charCode, rotationKey) => {
    return ((charCode << rotationKey) | (charCode >> (8 - rotationKey))) & 0xFF;
};

// Custom Hashing Function with SHA-256, Beyond XOR, and HMAC
const customHash = (message, userId, timestamp) => {
    // Step 1: Base SHA-256 Hash
    const sha256Hash = crypto.createHash('sha256')
        .update(message + userId + timestamp + SECRET_KEY)
        .digest('hex');

    // Step 2: Apply Beyond XOR Transformations
    const rotationKey = 5; // Example rotation key
    let transformedHash = '';
    for (let i = 0; i < sha256Hash.length; i++) {
        let charCode = sha256Hash.charCodeAt(i);

        // Bitwise rotate the character code
        charCode = bitwiseRotate(charCode, rotationKey);

        // Perform modular addition for additional complexity
        charCode = (charCode + 123) % 256;

        // Convert back to a character and append to the transformed hash
        transformedHash += String.fromCharCode(charCode);
    }

    // Step 3: Apply HMAC with Secret Key
    const hmacHash = crypto.createHmac('sha256', SECRET_KEY)
        .update(transformedHash)
        .digest('hex');

    // Combine the HMAC and transformed hash for the final result
    return hmacHash + transformedHash;
};

// Compare Method to Ensure Integrity
const compareHash = (originalMessage, userId, timestamp, receivedHash) => {
    // Recalculate the hash for the provided message, userId, and timestamp
    const calculatedHash = customHash(originalMessage, userId, timestamp);

    // Compare the recalculated hash with the received hash
    return calculatedHash === receivedHash;
};

// // Example Usage
// const message = "How are you Saddam Hussain?";
// const userId = "12345";
// const timestamp = Date.now();

// // Generate a hash for the message
// const integrityHash = customHash(message, userId, timestamp);
// console.log("Generated Hash:", integrityHash);

// // Compare the hash to validate integrity
// const isValid = compareHash(message, userId, timestamp, integrityHash);
// console.log("Integrity Valid:", isValid); // Output: true

// // Simulate tampering and re-validate
// const tamperedMessage = "How are you Saddam Hussain";
// const isTamperedValid = compareHash(tamperedMessage, userId, timestamp, integrityHash);
// console.log("Tampered Integrity Valid:", isTamperedValid); // Output: false


module.exports = { customHash, compareHash };