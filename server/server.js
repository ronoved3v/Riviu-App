const dotenv = require("dotenv").config();
const app = require("./app");
const { mongodbConnection } = require("./config");

(async () => {
  try {
    // Connect to MongoDB
    await mongodbConnection();

    // Start the server
    app.listen(process.env.DEFAULT_PORT, () => {
      console.log("Server is running!");
    });
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit the process with an error code
  }
})();
