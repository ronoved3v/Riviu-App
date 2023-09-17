const AppStore = require("../../models/AppStore");
const { iTunesLookup, iTunesSearch } = require("../../utils/crawlerDataApple");
const telegram = require("../../utils/telegramNotification");

module.exports = {
  // Retrieve List of Apps from iTunes Store Database

  // This asynchronous function, 'iTunes', is an API endpoint used to retrieve a list of apps from the iTunes Store database. It expects no query parameters and fetches the entire list of apps stored in the 'AppStore' collection.

  iTunes: async (req, res) => {
    try {
      // Attempt to find all apps in the 'AppStore' collection.
      const listAllApp = await AppStore.find();

      // Check if the fetched list is empty; if so, return a 404 Not Found response.
      if (listAllApp.length === 0) {
        return res.status(404).json({
          code: 404,
          message: "There are no applications in the data",
        });
      }

      // Log the incoming request method and URL to a Telegram channel or service (assuming 'telegram' is set up elsewhere in the code).

      await telegram.sendMessage(`*${req.method} from ${req.originalUrl}*`);

      // Return a 200 OK response with the list of apps as JSON data.
      return res.status(200).json({ code: 200, data: listAllApp });
    } catch (error) {
      // In case of an error during the process, log the error to the console and return a 500 Internal Server Error response.
      console.log(error);
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    }
  },

  // Search for Apps on iTunes Store

  // This asynchronous function, 'iTunesSearch', is an API endpoint used to search for apps on the iTunes Store based on the provided search term ('term'), country, and result limit. These parameters are expected to be provided as query parameters in the HTTP request.

  iTunesSearch: async (req, res) => {
    try {
      // Extract the search parameters ('term', 'country', 'limit') from the query parameters of the HTTP request.
      const { term, country, limit } = req.query;

      // Call the 'iTunesSearch' function to perform the app search based on the provided parameters.
      const results = await iTunesSearch(term, country, limit);

      // Check if the 'results' contain a 'code' property indicating an error (e.g., 400 Bad Request).
      if (results.code === 400) {
        // If an error is detected, return a 400 Bad Request response with the error details.
        return res.status(400).json(results);
      }

      // If no error is detected, return a 200 OK response with the search results as JSON data.
      return res.status(200).json(results);
    } catch (error) {
      // In case of an error during the process, return a 500 Internal Server Error response.
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    }
  },

  // Lookup App Information in the iTunes Store

  // This asynchronous function, 'iTunesLookup', is an API endpoint used to retrieve detailed information about an app from the iTunes Store based on its unique identifier, 'id', which is expected to be provided as a query parameter in the HTTP request.

  iTunesLookup: async (req, res) => {
    try {
      // Extract the 'id' from the query parameters of the HTTP request.
      const { id } = req.query;

      // Check if 'id' is missing or empty; if so, return a 400 Bad Request response.
      if (!id)
        return res.status(400).json({ code: 400, message: "Bad request" });

      // Call the 'iTunesLookup' function to fetch app information based on the provided 'id'.
      const results = await iTunesLookup(id);

      // Return a 200 OK response with the fetched app information as JSON data.
      return res.status(200).json(results);
    } catch (error) {
      // In case of an error during the process, return a 500 Internal Server Error response.
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
  },

  // Add an App to the iTunes Store Database

  // This asynchronous function, 'iTunesAdd', is used to add an app to the iTunes Store database based on the provided 'trackViewUrl' which is expected to contain the App Store URL of the app.

  iTunesAdd: async (req, res) => {
    try {
      // Extract the 'trackViewUrl' from the request body.
      const { trackViewUrl, platform } = req.body;

      // Extract the 'appId' from the 'trackViewUrl' using a regular expression.
      const appUrlmatch = trackViewUrl.match(/\/id(\d+)/);

      // If 'appUrlmatch' is found and contains an 'appId', create the 'outputAppURL' with a standardized format.
      if (appUrlmatch && appUrlmatch[1]) {
        var appId = appUrlmatch[1];
        var outputAppURL = `https://apps.apple.com/app/id${appId}`;
      } else {
        // If 'appId' is not found in the URL, return a 400 Bad Request response.
        return res
          .status(400)
          .json({ code: 400, message: "ID not found in URL." });
      }

      // Check if an app with the same 'trackId' (appId) already exists in the database.
      const checkAppExisting = await AppStore.findOne({ trackId: appId });

      // If the app already exists, return a 400 Bad Request response.
      if (checkAppExisting)
        return res
          .status(400)
          .json({ code: 400, message: "App already exists" });

      // Fetch detailed app information from iTunes Store using the 'iTunesLookup' function.
      const getAppInformation = await iTunesLookup(appId);

      // If app information is not found (returns 'undefined'), return a 404 Not Found response.
      if (getAppInformation === undefined) {
        return res
          .status(404)
          .json({ code: 404, message: "iTunes lookup not found" });
      }

      // Create a new 'AppStore' document using the fetched app information and 'platform', and save it to the database.
      const newAppStore = new AppStore({
        ...getAppInformation,
        platform, // Assign the 'platform' value to the 'platform' field in the 'AppStore' schema.
      });
      await newAppStore.save();

      // Log the incoming request method and URL to a Telegram channel or service (assuming 'telegram' is set up elsewhere in the code).

      await telegram.sendMessage(
        `*An application has been added*\n*Application name:* ${newAppStore.trackCensoredName}\n*Application ID:* ${newAppStore.trackId}\n*Platform:* ${newAppStore.platform}`
      );

      // Return a 201 Created response with the newly created 'AppStore' document.
      return res.status(201).json(newAppStore);
    } catch (error) {
      // In case of an error during the process, return a 500 Internal Server Error response.
      console.log(error);
      return res.status(500).json({ code: 500, message: "Error" });
    }
  },
};
