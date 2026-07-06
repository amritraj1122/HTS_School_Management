const TeachingAssignment = require("../../models/TeachingAssignment");
const StudentEnrollment = require("../../models/StudentEnrollment");
const Mark = require("../../models/Marks");
const Exam = require("../../models/Exam");

const loadMarks = async (req, res) => {
  try {
    const { exam, assignment } = req.query;

    if (!exam || !assignment) {
      return res.status(400).json({
        success: false,
        message: "Exam and Assignment are required.",
      });
    }

    // Get Exam
    const examData = await Exam.findById(exam);

    if (!examData) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    // Get Teaching Assignment
    const teachingAssignment = await TeachingAssignment.findById(assignment)
      .populate("class")
      .populate("subject")
      .populate("session");

    if (!teachingAssignment) {
      return res.status(404).json({
        success: false,
        message: "Teaching Assignment not found.",
      });
    }

    // Get Student Enrollments
    const enrollments = await StudentEnrollment.find({
      session: teachingAssignment.session._id,
      class: teachingAssignment.class._id,
      section: teachingAssignment.section,
      active: true,
    })
      .populate("student", "name admissionNo")
      .sort({ rollNo: 1 });

    // Get Existing Marks
    const marks = await Mark.find({
      exam,
      teachingAssignment: assignment,
    });

    const marksMap = {};

    marks.forEach((mark) => {
      marksMap[mark.studentEnrollment.toString()] = mark;
    });

    // Prepare Student List
    const students = enrollments.map((enrollment) => ({
      enrollmentId: enrollment._id,
      studentId: enrollment.student._id,
      admissionNo: enrollment.student.admissionNo,
      rollNo: enrollment.rollNo,
      name: enrollment.student.name,
      marks: marksMap[enrollment._id]?.marksObtained ?? "",
      absent: marksMap[enrollment._id]?.absent ?? false,
    }));

    // Response
    res.status(200).json({
      success: true,

      exam: {
        id: examData._id,
        name: examData.examName,
        maxMarks: examData.maxMarks,
      },

      assignment: {
        id: teachingAssignment._id,
        class: teachingAssignment.class.className,
        section: teachingAssignment.section,
        subject: teachingAssignment.subject.subjectName,
      },

      students,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = loadMarks;
