const crypto = require('crypto');

// Helper Function: Bitwise Rotation
const bitwiseRotate = (charCode, rotationKey) => {
    return ((charCode << rotationKey) | (charCode >> (8 - rotationKey))) & 0xff;
};

// Custom Hashing Function with SHA-256, Beyond XOR, and HMAC
const customHash = (message, userId, SECRET_KEY) => {
    // Step 1: Base SHA-256 Hash
    const sha256Hash = crypto.createHash('sha256')
        .update(message + userId + SECRET_KEY)
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
const compareHash = (originalMessage, userId, receivedHash, SECRET_KEY) => {
    // Recalculate the hash for the provided message and userId
    const calculatedHash = customHash(originalMessage, userId, SECRET_KEY);

    // Compare the recalculated hash with the received hash
    return calculatedHash === receivedHash;
};

module.exports = { customHash, compareHash };
