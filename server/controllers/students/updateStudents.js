const Student = require("../../models/Students");

const updateStudent = async (req, res) => {
  try {
    const { name, fatherName, gender } = req.body;

    if (!name?.trim() || !fatherName?.trim() || !gender) {
      return res.status(400).json({
        success: false,
        message: "Student name, father's name, and gender are required.",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        fatherName: fatherName.trim(),
        gender,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      student,
    });
  } catch (error) {
    console.error("Update Student Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = updateStudent;
