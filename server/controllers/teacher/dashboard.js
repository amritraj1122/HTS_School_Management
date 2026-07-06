const Teacher = require("../../models/Teacher");
const Session = require("../../models/Session");
const Exam = require("../../models/Exam");
const TeachingAssignment = require("../../models/TeachingAssignment");

const dashboard = async (req, res) => {
  try {
    // For now we'll receive teacherId in the URL.
    // Later we'll get it from JWT after login.
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    // Current active session
    const session = await Session.findOne({ active: true });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found.",
      });
    }

    // Exams for current session
    const exams = await Exam.find({
      session: session._id,
      active: true,
    }).sort({ displayOrder: 1 });

    // Teaching assignments
    const assignments = await TeachingAssignment.find({
      teacher: teacher._id,
      session: session._id,
      active: true,
    })
      .populate("class", "className")
      .populate("subject", "subjectName");

    res.status(200).json({
      success: true,
      teacher,
      session,
      exams,
      assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = dashboard;
