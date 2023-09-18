const mongoose = require("mongoose");

const application = new mongoose.Schema(
  {
    trackId: { type: String, index: true, unique: true },
    trackViewUrl: { type: String },
    trackCensoredName: { type: String },
    artworkUrl: { type: String },
    screenshotUrls: { type: Array },
    artistName: { type: String },
    description: { type: String },
    supportedDevices: { type: Array },
    primaryGenreName: { type: String },
    genres: { type: Array },
    userRatingCount: { type: Number },
    averageUserRating: { type: Number },
    releaseDate: { type: Date },
    version: { type: String },
    platform: { type: String },
    testFlights: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestFlight",
      },
    ],
  },
  { timestamps: true, collection: "applications" }
);

module.exports = mongoose.model("Application", application);
