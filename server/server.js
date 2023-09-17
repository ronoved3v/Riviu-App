const dotenv = require("dotenv").config(); // Load environment variables from .env file
const app = require("./app"); // Import the Express.js application
const { mongodbConnection } = require("./config"); // Import MongoDB connection function from config module

// Use an immediately invoked async function to manage asynchronous operations
(async () => {
  try {
    // Connect to MongoDB using the mongodbConnection function
    await mongodbConnection();

    // Start the server on the specified port (from environment variables)
    app.listen(process.env.DEFAULT_PORT, () => {
      console.log("Server is running!");
    });
  } catch (error) {
    // If an error occurs during the setup process, log the error
    console.error(error);

    // Exit the Node.js process with an error code to indicate failure
    process.exit(1);
  }
})();
