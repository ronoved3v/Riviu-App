const mongoose = require("mongoose");

const testFlight = new mongoose.Schema(
  {
    testFlightId: { type: String, require: true, unique: true, index: true },
    testFlightData: {
      appName: { type: String },
      appStatus: { type: String },
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  },
  { timestamps: true, collection: "testFlights" }
);

module.exports = mongoose.model("TestFlight", testFlight);
