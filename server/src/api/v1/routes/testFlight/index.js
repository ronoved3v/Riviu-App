const router = require("express").Router();
const testFlightController = require("../../controllers/testflight/index");

// Add TestFlight
router.post("/add", testFlightController.testFlightAdd);
router.get("/", testFlightController.testFlight);

module.exports = router;
