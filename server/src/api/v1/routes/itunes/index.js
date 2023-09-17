const router = require("express").Router();
const iTunesController = require("../../controllers/itunes/index");

// Add a app
router.post("/itunes/add", iTunesController.iTunesAdd);

// Get all app
router.get("/itunes", iTunesController.iTunes);

// Test Router
router.post("/itunes/search", iTunesController.iTunesSearch);

// iTunes Lookup
router.post("/itunes/lookup", iTunesController.iTunesLookup);

module.exports = router;
