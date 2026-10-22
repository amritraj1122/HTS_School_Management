const Student = require("../../models/Students");
const generateAdmissionNo = require("../../services/student/generateAdmissionNo");

const createStudent = async (req, res) => {
  try {
    const { name, fatherName, gender } = req.body;

    // Validate required fields
    if (!name?.trim() || !fatherName?.trim() || !gender) {
      return res.status(400).json({
        success: false,
        message: "Student name, father's name, and gender are required.",
      });
    }

    // Generate Admission Number
    const admissionNo = await generateAdmissionNo();

    // Create Student
    const student = await Student.create({
      admissionNo,
      name: name.trim(),
      fatherName: fatherName.trim(),
      gender,
    });

    res.status(201).json({
      success: true,
      message: "Student Created Successfully",
      student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to create student.",
    });
  }
};

module.exports = createStudent;
