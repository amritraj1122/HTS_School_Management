const StudentEnrollment = require("../../models/StudentEnrollment");
const TeachingAssignment = require("../../models/TeachingAssignment");
const Mark = require("../../models/Marks");
const Exam = require("../../models/Exam");

const getClassReport = async (req, res) => {
  try {
    const { session, exam, class: classId, section } = req.query;

    if (!session || !exam || !classId || !section) {
      return res.status(400).json({
        success: false,
        message: "Session, Exam, Class and Section are required.",
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

    // PT + Main Exam of same Result Type
    const exams = await Exam.find({
      session,
      resultType: selectedExam.resultType,
      active: true,
    }).sort({ displayOrder: 1 });

    if (exams.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Exam configuration is invalid.",
      });
    }

    const ptExam = exams[0];
    const termExam = exams[1];

    // Students
    const enrollments = await StudentEnrollment.find({
      session,
      class: classId,
      section,
      active: true,
    })
      .populate("student")
      .populate("session")
      .populate("class")
      .sort({ rollNo: 1 });

    // Subjects
    const assignments = await TeachingAssignment.find({
      session,
      class: classId,
      section,
      active: true,
    })
      .populate("subject")
      .sort({ "subject.subjectName": 1 });

    const students = [];

    for (const enrollment of enrollments) {
      const subjects = [];

      let grandTotal = 0;
      let maximumTotal = 0;

      for (const assignment of assignments) {
        if (!assignment.subject) continue;

        const ptMark = await Mark.findOne({
          exam: ptExam._id,
          teachingAssignment: assignment._id,
          studentEnrollment: enrollment._id,
        });

        const termMark = await Mark.findOne({
          exam: termExam._id,
          teachingAssignment: assignment._id,
          studentEnrollment: enrollment._id,
        });

        const ptMarks = ptMark && !ptMark.absent ? ptMark.marksObtained : 0;

        const termMarks =
          termMark && !termMark.absent ? termMark.marksObtained : 0;

        const totalMarks = ptMarks + termMarks;

        grandTotal += totalMarks;

        maximumTotal += assignment.subject.fullMarks;

        subjects.push({
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
        (subject) => subject.totalMarks >= subject.passingMarks,
      )
        ? "PASS"
        : "FAIL";

      students.push({
        student: {
          admissionNo: enrollment.student.admissionNo,
          name: enrollment.student.name,
          fatherName: enrollment.student.fatherName,
          class: enrollment.class.className,
          section: enrollment.section,
          rollNo: enrollment.rollNo,
          session: enrollment.session.sessionName,
        },

        subjects,

        grandTotal,

        maximumTotal,

        percentage,

        result,
      });
    }

    res.status(200).json({
      success: true,

      resultType: selectedExam.resultType,

      exam: {
        ptExam: ptExam.examName,
        ptMaxMarks: ptExam.maxMarks,

        termExam: termExam.examName,
        termMaxMarks: termExam.maxMarks,
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

module.exports = getClassReport;
