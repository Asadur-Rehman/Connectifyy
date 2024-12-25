const { generatetoken, validatetoken } = require("./generateToken")
const exampleUseCase = () => {
    const userId = "676a89371cccdf7a8d099e4a"; // Example user ID
  
    // Step 1: Generate a token for the given user ID
    const generatedToken = generatetoken(userId);
    console.log("Generated Token:", generatedToken);
  
    // Step 2: Decode the token to validate and retrieve user data
    try {
      const decodedData = validatetoken(generatedToken);
      console.log("Decoded Data:", decodedData);
    } catch (error) {
      console.error("Token validation failed:", error.message);
    }
  };
  
  // Run the example use case
  exampleUseCase();
  