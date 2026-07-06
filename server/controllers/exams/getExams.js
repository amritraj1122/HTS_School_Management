const Exam = require("../../models/Exam");

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("session", "sessionName")
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getExams;
