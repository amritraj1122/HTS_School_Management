const Exam = require("../../models/Exam");

const createExam = async (req, res) => {
  try {
    const {
      session,
      examCode,
      examName,
      maxMarks,
      displayOrder,
      resultType,
      active,
    } = req.body;

    if (
      !session ||
      !examCode ||
      !examName ||
      !maxMarks ||
      !displayOrder ||
      !resultType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingExam = await Exam.findOne({
      session,
      examCode,
    });

    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "Exam already exists for this session.",
      });
    }

    const exam = await Exam.create({
      session,
      examCode: examCode.toUpperCase(),
      examName,
      maxMarks: Number(maxMarks),
      displayOrder: Number(displayOrder),
      resultType,
      active,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully.",
      exam,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = createExam;
