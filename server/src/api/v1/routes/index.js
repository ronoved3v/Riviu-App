const router = require("express").Router();

const testFlightRoutes = require("../routes/testFlight/index");
const applicationRoutes = require("../routes/application/index");

router.use("/v1/application", applicationRoutes);
router.use("/v1/testflight", testFlightRoutes);
module.exports = router;
