const Teacher = require("../../models/Teacher");

const updateTeacher = async (req, res) => {
  try {
    const { name, email, mobile, active } = req.body;

    // Check if another teacher is already using this email
    const existingTeacher = await Teacher.findOne({
      email,
      _id: { $ne: req.params.id },
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,

      {
        name,
        email,
        mobile,
        active,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,

        message: "Teacher not found.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Teacher Updated Successfully",

      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = updateTeacher;
