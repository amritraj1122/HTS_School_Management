const Teacher = require("../../models/Teacher");
const bcrypt = require("bcryptjs");

const createTeacher = async (req, res) => {
  try {
    const { name, email, mobile, active } = req.body;

    // Check duplicate email
    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Count teachers
    const teacherCount = await Teacher.countDocuments();

    // Generate Teacher ID
    const teacherId = `HTS-T${String(teacherCount + 1).padStart(3, "0")}`;

    // Generate Password
    const plainPassword = `HTS@${Math.floor(1000 + Math.random() * 9000)}`;

    // Hash Password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const teacher = await Teacher.create({
      teacherId,

      name,

      email,

      mobile,

      active,

      password: hashedPassword,
    });

    res.status(201).json({
      success: true,

      teacherId,

      password: plainPassword,

      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = createTeacher;
