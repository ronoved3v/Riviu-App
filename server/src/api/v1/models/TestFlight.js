const mongoose = require("mongoose");

const testFlight = new mongoose.Schema(
  {
    testFlightId: { type: String, require: true, unique: true },
    testFlightData: {
      appName: { type: String },
      appIcon: { type: String },
      appStatus: { type: String },
    },
    appStoreInfor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppStoreInfor",
    },
  },
  { timestamps: true, collection: "testFlights" }
);

module.exports = mongoose.model("TestFlight", testFlight);
