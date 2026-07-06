const params = new URLSearchParams(window.location.search);

const session = params.get("session");
const exam = params.get("exam");
const classId = params.get("class");
const section = params.get("section");

if (!session || !exam || !classId || !section) {
  alert("Invalid Request");
  throw new Error("Missing Parameters");
}

async function loadClassReport() {
  try {
    const data = await API.get(
      `/api/results/class-report?session=${session}&exam=${exam}&class=${classId}&section=${section}`,
    );

    renderClassReports(data);
  } catch (error) {
    console.error(error);

    alert("Unable to load report cards.");
  }
}

loadClassReport();

function renderClassReports(data) {
  const container = document.getElementById("reportContainer");

  container.innerHTML = "";

  data.students.forEach((student) => {
    let rows = "";

    student.subjects.forEach((subject) => {
      rows += `

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

    let grade = "F";

    if (student.percentage >= 90) grade = "A+";
    else if (student.percentage >= 80) grade = "A";
    else if (student.percentage >= 70) grade = "B+";
    else if (student.percentage >= 60) grade = "B";
    else if (student.percentage >= 50) grade = "C";
    else if (student.percentage >= 40) grade = "D";

    container.innerHTML += `

      <div class="report-card">

        <div class="header">

          <img src="../../assets/images/logo.png" class="logo">

          <div class="school-details">

            <h1>HOLY TRINITY SCHOOL</h1>

            <h3>Gaighat, Patna - 7</h3>

            <h2>${data.resultType}</h2>

            <p>Session : ${student.student.session}</p>

          </div>

          <div class="photo-box">

            Paste Photo

          </div>

        </div>

        <table class="student-info">

          <tr>

            <td>

              Student Name :

              <strong>${student.student.name}</strong>

            </td>

          </tr>

          <tr>

            <td>

              Admission No :

              ${student.student.admissionNo}

              &nbsp;&nbsp;&nbsp;

              Roll :

              ${student.student.rollNo}

              &nbsp;&nbsp;&nbsp;

              Class :

              ${student.student.class}

              &nbsp;&nbsp;&nbsp;

              Section :

              ${student.student.section}

            </td>

          </tr>

        </table>

        <table class="marks-table">

          <thead>

            <tr>

              <th rowspan="2">Subject</th>

              <th rowspan="2">Full Marks</th>

              <th rowspan="2">Pass Marks</th>

              <th colspan="3">Marks Obtained</th>

            </tr>

            <tr>

              <th>${data.exam.ptExam} (${data.exam.ptMaxMarks})</th>

              <th>${data.exam.termExam} (${data.exam.termMaxMarks})</th>

              <th>Total</th>

            </tr>

          </thead>

          <tbody>

            ${rows}

          </tbody>

        </table>

        <table class="summary">

          <tr>

            <td>Total</td>

            <td>${student.grandTotal} / ${student.maximumTotal}</td>

          </tr>

          <tr>

            <td>Percentage</td>

            <td>${student.percentage}%</td>

          </tr>

          <tr>

            <td>Grade</td>

            <td>${grade}</td>

          </tr>

          <tr>

            <td>Result</td>

            <td>${student.result}</td>

          </tr>

        </table>

        <div class="remarks">

          <h3>Teacher's Remarks</h3>

          <div class="remarks-box"></div>

        </div>

        <div class="signatures">

          <div>

            ______________________

            <br>

            Principal Signature

          </div>

          <div>

            ______________________

            <br>

            Class Teacher Signature

          </div>

        </div>

      </div>

    `;
  });
}
