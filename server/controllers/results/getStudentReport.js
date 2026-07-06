const StudentEnrollment = require("../../models/StudentEnrollment");
const TeachingAssignment = require("../../models/TeachingAssignment");
const Mark = require("../../models/Marks");
const Exam = require("../../models/Exam");

const getStudentReport = async (req, res) => {
  try {
    const { session, studentEnrollment, exam } = req.query;

    if (!session || !studentEnrollment || !exam) {
      return res.status(400).json({
        success: false,
        message: "Session, Student and Exam are required.",
      });
    }

    // Student Details
    const enrollment = await StudentEnrollment.findById(studentEnrollment)
      .populate("student")
      .populate("session")
      .populate("class");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Selected Exam
    const selectedExam = await Exam.findById(exam);

    if (!selectedExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    // Find PT + Term belonging to the same result
    const exams = await Exam.find({
      session,
      resultType: selectedExam.resultType,
      active: true,
    }).sort({ displayOrder: 1 });

    if (exams.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam configuration.",
      });
    }

    const ptExam = exams[0];
    const termExam = exams[1];

    // Teaching Assignments
    const assignments = await TeachingAssignment.find({
      session,
      class: enrollment.class._id,
      section: enrollment.section,
      active: true,
    })
      .populate("subject")
      .sort({ "subject.subjectName": 1 });

    const subjects = [];

    let grandTotal = 0;
    let maximumTotal = 0;

    for (const assignment of assignments) {
      if (!assignment.subject) continue;

      const ptMark = await Mark.findOne({
        exam: ptExam._id,
        teachingAssignment: assignment._id,
        studentEnrollment,
      });

      const termMark = await Mark.findOne({
        exam: termExam._id,
        teachingAssignment: assignment._id,
        studentEnrollment,
      });

      const ptMarks =
        ptMark && !ptMark.absent ? ptMark.marksObtained : 0;

      const termMarks =
        termMark && !termMark.absent ? termMark.marksObtained : 0;

      const totalMarks = ptMarks + termMarks;

      grandTotal += totalMarks;

      maximumTotal += assignment.subject.fullMarks;

      subjects.push({
        subjectId: assignment.subject._id,
        subjectCode: assignment.subject.subjectCode,
        subjectName: assignment.subject.subjectName,

        fullMarks: assignment.subject.fullMarks,
        passingMarks: assignment.subject.passingMarks,

        ptMarks,
        termMarks,
        totalMarks,

        ptAbsent: ptMark ? ptMark.absent : false,
        termAbsent: termMark ? termMark.absent : false,
      });
    }

    const percentage =
      maximumTotal > 0
        ? Number(((grandTotal / maximumTotal) * 100).toFixed(2))
        : 0;

    const result = subjects.every(
      (subject) => subject.totalMarks >= subject.passingMarks
    )
      ? "PASS"
      : "FAIL";

    res.status(200).json({
      success: true,

      student: {
        admissionNo: enrollment.student.admissionNo,
        name: enrollment.student.name,
        fatherName: enrollment.student.fatherName,
        class: enrollment.class.className,
        section: enrollment.section,
        rollNo: enrollment.rollNo,
        session: enrollment.session.sessionName,
      },

      exam: {
        ptExam: ptExam.examName,
        ptMaxMarks: ptExam.maxMarks,
        termExam: termExam.examName,
        termMaxMarks: termExam.maxMarks,
      },

      resultType: selectedExam.resultType,

      subjects,

      grandTotal,

      maximumTotal,

      percentage,

      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getStudentReport;