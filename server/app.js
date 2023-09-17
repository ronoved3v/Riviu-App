const express = require("express");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(compression()); // Enable response compression
app.use(express.json()); // Parse incoming JSON data
app.use(cookieParser()); // Parse incoming cookies

// Routing setup
app.use("/api", require("./src/api/v1/routes/index")); // Use API routes from ./src/api/v1/routes/index module

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: "Internal Server Error" });
});

module.exports = app;
