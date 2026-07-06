const Session = require("../../models/Session");

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ startYear: -1 });

    res.status(200).json({
      success: true,

      total: sessions.length,

      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = getSessions;
