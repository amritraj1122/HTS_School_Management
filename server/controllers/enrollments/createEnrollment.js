const StudentEnrollment = require("../../models/StudentEnrollment");

const createEnrollment = async (req, res) => {
  try {
    const {
      student,
      session,
      class: classId,
      section,
      rollNo,
      active,
    } = req.body;

    // Check if student is already enrolled in this session
    const existingEnrollment = await StudentEnrollment.findOne({
      student,
      session,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this session.",
      });
    }

    // Check duplicate roll number
    const existingRoll = await StudentEnrollment.findOne({
      session,
      class: classId,
      section,
      rollNo,
    });

    if (existingRoll) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists in this class and section.",
      });
    }

    const enrollment = await StudentEnrollment.create({
      student,
      session,
      class: classId,
      section,
      rollNo,
      active,
    });

    res.status(201).json({
      success: true,
      message: "Student Enrolled Successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = createEnrollment;
