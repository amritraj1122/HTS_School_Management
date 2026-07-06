const Teacher = require("../../models/Teacher");

const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,

        message: "Teacher not found.",
      });
    }

    res.status(200).json({
      success: true,

      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = getTeacher;
