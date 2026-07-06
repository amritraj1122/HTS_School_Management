const TeachingAssignment = require("../../models/TeachingAssignment");

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await TeachingAssignment.findByIdAndDelete(
      req.params.id,
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Assignment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = deleteAssignment;
