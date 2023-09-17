const mongoose = require("mongoose");

module.exports = {
  // Establish a connection to MongoDB.
  // Returns a Promise that resolves when the connection is successful or rejects on error.
  mongodbConnection: async () => {
    try {
      // Use async/await to handle the connection asynchronously.
      await mongoose.connect(process.env.MONGODB_URL);

      // If the connection is successful, this line will be reached.
      console.log("Connection to MongoDB successful!");
    } catch (error) {
      // If an error occurs during the connection, it will be caught here.
      console.error("Failed to connect with MongoDB!");
      console.error(error); // Log the error details for debugging.
    }
  },
};
