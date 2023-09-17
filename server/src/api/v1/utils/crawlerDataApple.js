const axios = require("axios");
const cheerio = require("cheerio");
const { decodeHtmlEntities } = require("./decodeHtmlEntities");

module.exports = {
  // * Search App on iTunes

  // This asynchronous function, 'iTunesSearch', is used to search for apps on the iTunes Store based on a given search term, country, and limit.

  iTunesSearch: async (term, country, limit) => {
    try {
      // If 'country' is not provided, default it to "US".
      if (!country) country = "US";

      // If 'limit' is not provided, default it to 5.
      if (!limit) limit = 5;

      // Sanitize and decode the HTML entities in the search term using the 'decodeHtmlEntities' function, assuming it's defined elsewhere in your code.
      const appName = await decodeHtmlEntities(term);

      // Make an HTTP POST request to the iTunes Search API with the provided parameters.
      const response = await axios.post(
        `https://itunes.apple.com/search?term=${appName}&country=${country}&media=software&entity=software&limit=${limit}`
      );

      // Return the 'results' data from the API response, which contains information about the searched apps.
      return response.data["results"];
    } catch (error) {
      // In case of an error, catch the exception and return a custom error object with a code and message.
      // The 'error.response.data.errorMessage' likely comes from the response of the iTunes API and can be returned as part of the error message.
      return { code: 400, message: error.response.data.errorMessage };
    }
  },

  // * Function to get app information from the iTunes

  // This asynchronous function, 'iTunesLookup', is used to fetch detailed information about an app from the App Store based on its unique identifier, 'id'.

  iTunesLookup: async (id) => {
    try {
      // Make an HTTP GET request to the iTunes lookup API with the provided 'id'.
      const response = await axios.get(
        `https://itunes.apple.com/lookup?id=${id}`
      );

      // Extract relevant data from the response, assuming that the API response is structured as expected.
      const {
        trackId,
        trackViewUrl,
        trackCensoredName,
        artworkUrl,
        screenshotUrls,
        artistName,
        description,
        supportedDevices,
        primaryGenreName,
        genres,
        userRatingCount,
        averageUserRating,
        releaseDate,
        version,
      } = response.data.results[0];

      // Map and filter supported devices to a unique list, converting device names to a standardized format.
      const filteredDevices = supportedDevices.map((device) => {
        device = device.toLowerCase();
        if (device.includes("iphone")) {
          return "iPhone";
        } else if (device.includes("ipad")) {
          return "iPad";
        } else if (device.includes("ipod")) {
          return "iPod";
        } else if (device.includes("mac")) {
          return "Mac";
        } else if (device.includes("watch")) {
          return "Watch";
        }
      });

      // Create a set to remove duplicate device types and store them in 'uniqueDevices'.
      const uniqueDevices = [...new Set(filteredDevices)];

      // Remove newline characters ('\n') from the app description and store it as 'changeDescription'.
      const originalDescription = description;
      const changeDescription = originalDescription.replace(/\n/g, "<br>");

      // Return the formatted app information as an object with the extracted data.
      return {
        trackId,
        trackViewUrl,
        trackCensoredName,
        artworkUrl,
        screenshotUrls: screenshotUrls || undefined, // Set 'screenshotUrls' to 'undefined' if it's not available.
        artistName,
        description: changeDescription,
        supportedDevices: uniqueDevices,
        primaryGenreName,
        genres,
        userRatingCount,
        averageUserRating,
        releaseDate,
        version,
      };
    } catch (error) {
      // In case of an error, log the error data to the console and return nothing.
      console.log(error);
      return { code: 400, message: "Error iTunes Lookup" };
    }
  },

  // * Function to check TestFlight status by ID
  checkTestFlightStatus: async (testFlightId) => {
    try {
      // Make a request to the TestFlight URL
      const response = await axios.get(
        `https://testflight.apple.com/join/${testFlightId}`
      );

      // Load the HTML response using Cheerio
      const $ = cheerio.load(response.data);

      // Extract relevant information
      const testFlightStatus = $("#status > div.beta-status > span").text();
      const appIcon = $(`link[rel="apple-touch-icon"]`).attr("href");
      const appNameMetaTag = $(`meta[property="og:title"]`).attr("content");
      const appNameRegex = /Join the (.+) beta/;
      const appNameMatch = appNameRegex.exec(appNameMetaTag);
      const appName = appNameMatch ? appNameMatch[1] : "";

      // Default app status is "unknown"
      let appStatus = "unknown";

      // Check different testFlightStatus conditions and update appStatus
      if (testFlightStatus.includes("This beta is full.")) {
        appStatus = "full";
      } else if (
        testFlightStatus.includes(
          "This beta isn't accepting any new testers right now."
        )
      ) {
        appStatus = "reject";
      } else if (
        testFlightStatus.includes(
          "open the link on your iPhone, iPad, or Mac after you install TestFlight."
        )
      ) {
        appStatus = "active";
      }

      // Return the extracted information
      return { appName, appIcon, appStatus };
    } catch (error) {
      // If an error occurs, return appStatus as "removed"
      return { appStatus: "removed" };
    }
  },
};
