const Teacher = require("../../models/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacherLogin = async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID and Password are required.",
      });
    }

    const teacher = await Teacher.findOne({
      teacherId,
      active: true,
    }).select("+password");

    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: "Invalid Teacher ID",
      });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: teacher._id,
        role: teacher.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      role: teacher.role,
      teacher: {
        id: teacher._id,
        teacherId: teacher.teacherId,
        name: teacher.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { teacherLogin };
