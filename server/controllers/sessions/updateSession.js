const Session = require("../../models/Session");

const updateSession = async (req, res) => {
  try {
    if (req.body.active) {
      await Session.updateMany(
        {},
        {
          active: false,
        },
      );
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,

      req.body,

      {
        new: true,
        runValidators: true,
      },
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session Updated Successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = updateSession;
