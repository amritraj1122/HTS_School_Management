const Mark = require("../../models/Marks");
const Exam = require("../../models/Exam");

const saveMarks = async (req, res) => {
  try {
    const { exam, assignment, marks } = req.body;

    if (!exam || !assignment || !Array.isArray(marks)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    // Get exam to validate maximum marks
    const examData = await Exam.findById(exam);

    if (!examData) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    for (const item of marks) {
      if (!item.absent && Number(item.marksObtained) > examData.maxMarks) {
        return res.status(400).json({
          success: false,
          message: `Marks cannot exceed ${examData.maxMarks}.`,
        });
      }

      await Mark.findOneAndUpdate(
        {
          exam,
          teachingAssignment: assignment,
          studentEnrollment: item.studentEnrollment,
        },
        {
          session: examData.session,
          exam,
          teachingAssignment: assignment,
          studentEnrollment: item.studentEnrollment,
          marksObtained: item.absent ? 0 : item.marksObtained,
          absent: item.absent || false,
          remarks: item.remarks || "",
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        },
      );
    }

    res.status(200).json({
      success: true,
      message: "Marks saved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = saveMarks;
