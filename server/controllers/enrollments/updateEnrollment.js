const StudentEnrollment = require("../../models/StudentEnrollment");

const updateEnrollment = async (req, res) => {
  try {
    const {
      student,
      session,
      class: classId,
      section,
      rollNo,
      active,
    } = req.body;

    const existingRoll = await StudentEnrollment.findOne({
      session,
      class: classId,
      section,
      rollNo,
      _id: { $ne: req.params.id },
    });

    if (existingRoll) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists.",
      });
    }

    const enrollment = await StudentEnrollment.findByIdAndUpdate(
      req.params.id,
      {
        student,
        session,
        class: classId,
        section,
        rollNo,
        active,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment Updated Successfully",
      enrollment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = updateEnrollment;