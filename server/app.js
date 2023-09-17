const express = require("express");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(compression());

app.use("/api", require("./src/api/v1/routes/index"));

module.exports = app;
