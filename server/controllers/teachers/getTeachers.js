const Teacher = require("../../models/Teacher");

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({
      teacherId: 1,
    });

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getTeachers;