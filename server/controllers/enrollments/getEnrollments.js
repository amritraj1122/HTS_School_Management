const StudentEnrollment = require("../../models/StudentEnrollment");

const getEnrollments = async (req, res) => {
  try {
    const { class: classId, section } = req.query;

    const filter = {};

    if (classId) {
      filter.class = classId;
    }

    if (section) {
      filter.section = section;
    }

    const enrollments = await StudentEnrollment.find(filter)
      .populate("student", "admissionNo name fatherName")
      .populate("session", "sessionName")
      .populate("class", "className")
      .sort({
        class: 1,
        section: 1,
        rollNo: 1,
      });

    res.status(200).json({
      success: true,
      total: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getEnrollments;
