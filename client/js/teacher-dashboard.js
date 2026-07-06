const token = localStorage.getItem("token");
const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!token || !teacher) {
  localStorage.clear();
  window.location.href = "/index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

let selectedExam = null;

async function loadDashboard() {
  try {
    const data = await API.get(`/api/teachers/dashboard/${teacher.id}`);

    renderTeacher(data);

    renderExams(data.exams);

    renderAssignments(data.assignments);
  } catch (error) {
    console.error(error);

    showToast("Session expired. Please login again.", "error");

    setTimeout(() => {
      logout();
    }, 1000);
  }
}

loadDashboard();

function renderTeacher(data) {
  document.getElementById("teacherInfo").innerHTML = `

    <h2>${data.teacher.name}</h2>

    <p>

      Current Session :

      ${data.session.sessionName}

    </p>

  `;
}

function renderExams(exams) {
  const container = document.getElementById("examCards");

  container.innerHTML = "";

  exams.forEach((exam) => {
    container.innerHTML += `

      <div
        class="card"
        onclick="selectExam('${exam._id}')">

        <h3>

          ${exam.examName}

        </h3>

        <p>

          ${exam.maxMarks} Marks

        </p>

      </div>

    `;
  });
}

function renderAssignments(assignments) {
  const container = document.getElementById("assignmentCards");

  container.innerHTML = "";

  assignments.forEach((item) => {
    container.innerHTML += `

      <div
        class="card"
        onclick="openMarks('${item._id}')">

        <h3>

          Class ${item.class.className}-${item.section}

        </h3>

        <p>

          ${item.subject.subjectName}

        </p>

      </div>

    `;
  });
}

function selectExam(id) {
  selectedExam = id;

  showToast("Exam Selected");
}

function openMarks(assignmentId) {
  if (!selectedExam) {
    showToast("Please select an exam first", "error");

    return;
  }

  window.location.href = `../marks/marks.html?exam=${selectedExam}&assignment=${assignmentId}`;
}
