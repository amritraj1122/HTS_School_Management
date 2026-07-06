const Session = require("../../models/Session");

const createSession = async (req, res) => {
  try {
    const { sessionName, startYear, endYear, active } = req.body;

    const existingSession = await Session.findOne({
      sessionName,
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "Session already exists.",
      });
    }

    // Only one active session
    if (active) {
      await Session.updateMany({}, { active: false });
    }

    const session = await Session.create({
      sessionName,
      startYear,
      endYear,
      active,
    });

    res.status(201).json({
      success: true,
      message: "Session Created Successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = createSession;
