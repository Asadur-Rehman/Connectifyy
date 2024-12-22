const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("MongoDB Connected"));
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

module.exports = connectDB;
