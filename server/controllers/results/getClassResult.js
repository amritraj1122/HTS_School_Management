const StudentEnrollment = require("../../models/StudentEnrollment");
const TeachingAssignment = require("../../models/TeachingAssignment");
const Mark = require("../../models/Marks");
const Exam = require("../../models/Exam");

const getClassResult = async (req, res) => {
  try {
    const { session, exam, class: classId, section } = req.query;

    if (!session || !exam || !classId || !section) {
      return res.status(400).json({
        success: false,
        message: "Session, Exam, Class and Section are required.",
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

    // Get Students
    const enrollments = await StudentEnrollment.find({
      session,
      class: classId,
      section,
      active: true,
    })
      .populate("student", "name admissionNo")
      .sort({ rollNo: 1 });

    // Get Teaching Assignments
    const assignments = await TeachingAssignment.find({
      session,
      class: classId,
      section,
      active: true,
    })
      .populate("subject")
      .sort({ "subject.subjectName": 1 });

    // Dynamic Subject Header
    const subjects = assignments.map((assignment) => ({
      subjectId: assignment.subject._id,
      subjectCode: assignment.subject.subjectCode,
      subjectName: assignment.subject.subjectName,
      fullMarks: assignment.subject.fullMarks,
      passingMarks: assignment.subject.passingMarks,
    }));

    // Maximum Marks of this Result
    const maximumTotal = assignments.reduce(
      (sum, assignment) => sum + assignment.subject.fullMarks,
      0,
    );

    const students = [];

    for (const enrollment of enrollments) {
      const studentResult = {
        enrollmentId: enrollment._id,
        rollNo: enrollment.rollNo,
        admissionNo: enrollment.student.admissionNo,
        name: enrollment.student.name,
        subjects: [],
        total: 0,
        percentage: 0,
      };

      for (const assignment of assignments) {
        const mark = await Mark.findOne({
          exam,
          teachingAssignment: assignment._id,
          studentEnrollment: enrollment._id,
        });

        const obtained = mark && !mark.absent ? mark.marksObtained : 0;

        studentResult.subjects.push({
          subjectId: assignment.subject._id,
          subjectCode: assignment.subject.subjectCode,
          subjectName: assignment.subject.subjectName,
          fullMarks: assignment.subject.fullMarks,
          passingMarks: assignment.subject.passingMarks,
          marks: obtained,
          absent: mark ? mark.absent : false,
        });

        studentResult.total += obtained;
      }

      studentResult.percentage =
        maximumTotal > 0
          ? Number(((studentResult.total / maximumTotal) * 100).toFixed(2))
          : 0;

      students.push(studentResult);
    }

    res.status(200).json({
      success: true,

      exam: {
        id: examData._id,
        examName: examData.examName,
        maxMarks: examData.maxMarks,
      },

      maximumTotal,

      subjects,

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

module.exports = getClassResult;
