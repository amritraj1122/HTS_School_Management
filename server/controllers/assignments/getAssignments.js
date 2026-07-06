const TeachingAssignment = require("../../models/TeachingAssignment");

const getAssignments = async (req, res) => {
  try {
    const { teacher } = req.query;

    const filter = {};

    if (teacher) {
      filter.teacher = teacher;
    }

    const assignments = await TeachingAssignment.find(filter)

      .populate("class", "className")

      .populate("subject", "subjectName")

      .populate("teacher", "name")

      .populate("session", "sessionName")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      total: assignments.length,

      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = getAssignments;
