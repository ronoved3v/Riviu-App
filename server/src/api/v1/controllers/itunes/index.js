const AppStore = require("../../models/AppStore");
const { iTunesLookup, iTunesSearch } = require("../../utils/crawlerDataApple");
const telegram = require("../../utils/telegramNotification");

module.exports = {
  getAllApp: async (req, res) => {
    try {
      const listAllApp = await AppStore.findOne();
      if (listAllApp.length === 0) {
        return res.status(404).json({
          code: 404,
          message: "There are no applications in the data",
        });
      }

      await telegram.sendMessage(`*${req.method} from ${req.originalUrl}*`);

      return res.status(200).json({ code: 200, data: listAllApp });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    }
  },
  iTunesSearch: async (req, res) => {
    try {
      const { term, country, limit } = req.query;
      const results = await iTunesSearch(term, country, limit);
      if (results.code === 400) {
        return res.status(400).json(results);
      }
      return res.status(200).json(results);
    } catch (error) {
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    }
  },
  iTunesLookup: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id)
        return res.status(400).json({ code: 400, message: "Bad request" });
      const results = await iTunesLookup(id);
      return res.status(200).json(results);
    } catch (error) {
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
  },
  appStoreAdd: async (req, res) => {
    try {
      const { trackViewUrl } = req.body;
      const appUrlmatch = trackViewUrl.match(/\/id(\d+)/);
      if (appUrlmatch && appUrlmatch[1]) {
        var appId = appUrlmatch[1];
        var outputAppURL = `https://apps.apple.com/app/id${appId}`;
      } else {
        return res
          .status(400)
          .json({ code: 400, message: "ID not found in URL." });
      }
      const checkAppExisting = await AppStore.findOne({ trackId: appId });
      if (checkAppExisting)
        return res
          .status(400)
          .json({ code: 400, message: "App already exists" });
      const getAppInformation = await iTunesLookup(appId);
      if (getAppInformation == undefined) {
        return res
          .status(404)
          .json({ code: 404, message: "iTunes lookup not found" });
      }

      const newAppStore = new AppStore(getAppInformation);
      await newAppStore.save();

      return res.status(201).json(newAppStore);
    } catch (error) {
      return res.status(500).json({ code: 500, message: "Error" });
    }
  },
};
