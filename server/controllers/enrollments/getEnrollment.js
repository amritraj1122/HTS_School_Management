const StudentEnrollment = require("../../models/StudentEnrollment");

const getEnrollment = async (req, res) => {
  try {
    const enrollment = await StudentEnrollment.findById(req.params.id)

      .populate("student")

      .populate("session")

      .populate("class");

    if (!enrollment) {
      return res.status(404).json({
        success: false,

        message: "Enrollment not found.",
      });
    }

    res.status(200).json({
      success: true,

      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = getEnrollment;
