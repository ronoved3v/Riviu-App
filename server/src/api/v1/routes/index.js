const router = require("express").Router();

const appStoreRoutes = require("../routes/itunes/index");
router.use("/v1/aapp", appStoreRoutes);
module.exports = router;
