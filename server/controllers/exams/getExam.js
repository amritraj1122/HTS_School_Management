const Exam = require("../../models/Exam");

const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "session",
      "sessionName",
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getExam;
