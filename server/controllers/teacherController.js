const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const getTeacher = require("./teachers/getTeacher");

// const createTeacher = async (req, res) => {
//   try {
//     const { name, email, mobile, subject } = req.body;

//     // Count existing teachers
//     const teacherCount = await Teacher.countDocuments();

//     // Generate Teacher ID
//     const teacherId = `HTS-T${String(teacherCount + 1).padStart(3, "0")}`;

//     // Generate Password
//     const plainPassword = `HTS@${Math.floor(1000 + Math.random() * 9000)}`;

//     // Hash Password
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     const teacher = await Teacher.create({
//       teacherId,
//       name,
//       email,
//       mobile,
//       subject,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       teacherId,
//       password: plainPassword,
//       teacher,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getTeachers = async (req, res) => {
//   try {
//     const teachers = await Teacher.find().sort({
//       teacherId: 1,
//     });

//     res.status(200).json({
//       success: true,
//       count: teachers.length,
//       teachers,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const updateTeacher = async (req, res) => {
//   try {
//     const teacher = await Teacher.findByIdAndUpdate(
//       req.params.id,

//       req.body,

//       { new: true },
//     );

//     res.json({
//       success: true,

//       teacher,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };

// const deleteTeacher = async (req, res) => {
//   try {
//     await Teacher.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,

//       message: "Teacher Deleted",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };


module.exports = {
  createTeacher: require("./teachers/createrTeacher"),
  getTeachers: require("./teachers/getTeachers"),
  getTeacher: require("./teachers/getTeacher"),
  updateTeacher: require("./teachers/updateTeacher"),
  deleteTeacher: require("./teachers/deleteTeacher"),
  dashboard: require("./teacher/dashboard")
};
