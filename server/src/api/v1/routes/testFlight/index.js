const router = require("express").Router();
const testFlightController = require("../../controllers/testflight/index");

// Get All TestFlight
router.get("/", testFlightController.testFlight);

// Add TestFlight
router.post("/add", testFlightController.testFlightAdd);

// Delete TestFlight
router.delete("/delete", (req, res) => {
  res.send(200);
});

module.exports = router;
