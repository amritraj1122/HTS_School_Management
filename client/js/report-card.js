const params = new URLSearchParams(window.location.search);

const session = params.get("session");
const studentEnrollment = params.get("studentEnrollment");
const exam = params.get("exam");

if (!session || !studentEnrollment || !exam) {
  alert("Invalid Report Card Request");
  throw new Error("Missing URL Parameters");
}

async function loadReportCard() {
  try {
    const data = await API.get(
      `/api/results/report?session=${session}&studentEnrollment=${studentEnrollment}&exam=${exam}`
    );

    if (!data.success) {
      alert(data.message);
      return;
    }

    renderReport(data);

  } catch (error) {
    console.error(error);
    alert("Unable to load report card.");
  }
}

loadReportCard();

function renderReport(data) {

  // ================= Student =================

  document.getElementById("examTitle").textContent =
    data.resultType;

  document.getElementById("session").textContent =
    data.student.session;

  document.getElementById("studentName").textContent =
    data.student.name;

  document.getElementById("admissionNo").textContent =
    data.student.admissionNo;

  document.getElementById("rollNo").textContent =
    data.student.rollNo;

  document.getElementById("className").textContent =
    data.student.class;

  document.getElementById("section").textContent =
    data.student.section;

  // ================= Dynamic Exam Headers =================

  document.getElementById("ptHeader").textContent =
    `${data.exam.ptExam} (${data.exam.ptMaxMarks})`;

  document.getElementById("termHeader").textContent =
    `${data.exam.termExam} (${data.exam.termMaxMarks})`;

  // ================= Marks Table =================

  const tbody = document.getElementById("marksBody");

  tbody.innerHTML = "";

  data.subjects.forEach(subject => {

    tbody.innerHTML += `

      <tr>

        <td>${subject.subjectName}</td>

        <td>${subject.fullMarks}</td>

        <td>${subject.passingMarks}</td>

        <td>${subject.ptAbsent ? "AB" : subject.ptMarks}</td>

        <td>${subject.termAbsent ? "AB" : subject.termMarks}</td>

        <td>${subject.totalMarks}</td>

      </tr>

    `;

  });

  // ================= Summary =================

  document.getElementById("grandTotal").textContent =
    `${data.grandTotal} / ${data.maximumTotal}`;

  document.getElementById("percentage").textContent =
    `${data.percentage}%`;

  document.getElementById("result").textContent =
    data.result;

  document.getElementById("remarks").textContent =
    data.remarks || "";

  // ================= Grade =================

  const grade = calculateGrade(data.percentage);

  document.getElementById("grade").textContent =
    grade;

}

function calculateGrade(percentage) {

  if (percentage >= 90) return "A+";

  if (percentage >= 80) return "A";

  if (percentage >= 70) return "B+";

  if (percentage >= 60) return "B";

  if (percentage >= 50) return "C";

  if (percentage >= 40) return "D";

  return "F";

}