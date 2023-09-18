const router = require("express").Router();
const applicationController = require("../../controllers/application/index");

// Add a app
router.post("/itunes/add", applicationController.applicationAdd);

// Get all app
router.get("/itunes", applicationController.applications);

// Test Router
router.post("/itunes/search", applicationController.applicationSearch);

// iTunes Lookup
router.post("/itunes/lookup", applicationController.applicationLookup);

module.exports = router;
