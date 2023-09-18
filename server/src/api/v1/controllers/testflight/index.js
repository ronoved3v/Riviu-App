const TestFlight = require("../../models/TestFlight");
const Application = require("../../models/Application");

const { checkTestFlightStatus } = require("../../utils/crawlerDataApple");

module.exports = {
  testFlight: async (req, res) => {
    try {
      const allTestFlight = await TestFlight.find().populate("application");
      if (!allTestFlight)
        return res
          .status(404)
          .json({ code: 404, message: "There is no TestFlight" });
      return res.status(200).json({ code: 200, data: allTestFlight });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
  },
  testFlightAdd: async (req, res) => {
    try {
      const { trackId, testFlightId } = req.body;

      const application = await Application.findOne({ trackId });
      if (!application)
        return res.status({ code: 400, message: "trackId not found" });

      if (!trackId || !testFlightId) {
        return res.status(400).json({
          code: 400,
          message: "Both trackId and testFlightId are required",
        });
      }

      if (!testFlightId.startsWith("https://testflight.apple.com/join/")) {
        return res
          .status(400)
          .json({ code: 400, message: "This is not a valid TestFlight URL" });
      }

      const parts = testFlightId.split("/");
      const code = parts[parts.length - 1];

      // Kiểm tra tính duy nhất của testFlightId
      const existingTestFlight = await TestFlight.findOne({
        testFlightId: code,
      });
      if (existingTestFlight) {
        return res
          .status(400)
          .json({ code: 400, message: "This testFlightId is already in use" });
      }

      const checkTestFlightStatusResult = await checkTestFlightStatus(code);

      const newTestFlight = new TestFlight({
        testFlightId: code,
        testFlightData: {
          appName: checkTestFlightStatusResult.appName,
          appStatus: checkTestFlightStatusResult.status,
        },
        application: application._id,
      });

      await newTestFlight.save();
      application.testFlights.push(newTestFlight._id);
      await application.save();
      console.log(checkTestFlightStatusResult.status);
      return res.status(200).json(newTestFlight);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
  },
};
