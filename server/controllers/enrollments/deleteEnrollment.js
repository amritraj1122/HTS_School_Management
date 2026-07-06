const StudentEnrollment = require("../../models/StudentEnrollment");

const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await StudentEnrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,

        message: "Enrollment not found.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Enrollment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = deleteEnrollment;
