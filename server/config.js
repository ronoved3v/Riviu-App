const mongoose = require("mongoose");

module.exports = {
  mongodbConnection: async () => {
    try {
      mongoose.connect(process.env.MONGODB_URL).catch((e) => {
        console.log("Failed to connect with MongoDB!");
      });
      console.log("Connection to MongoDB successful!");
    } catch (error) {
      console.log(error);
    }
  },
};
