const sessionSelect = document.getElementById("session");
const examSelect = document.getElementById("exam");
const classSelect = document.getElementById("class");
const sectionSelect = document.getElementById("section");

const loadBtn = document.getElementById("loadBtn");

async function initialize() {
  await DropdownService.loadSessions("session");
  await DropdownService.loadExams("exam");
  await DropdownService.loadClasses("class");
}

initialize();

classSelect.addEventListener("change", async () => {
  await DropdownService.loadSections("section", classSelect.value);
});

loadBtn.addEventListener("click", loadResult);

// =============================
// Print Entire Class Button
// =============================

const printAllBtn = document.createElement("button");

printAllBtn.textContent = "🖨 Print Entire Class";

printAllBtn.className = "print-btn";

printAllBtn.style.marginLeft = "10px";

printAllBtn.onclick = printEntireClass;

loadBtn.insertAdjacentElement("afterend", printAllBtn);

async function loadResult() {
  try {
    const data = await API.get(
      `/api/results/class?session=${sessionSelect.value}&exam=${examSelect.value}&class=${classSelect.value}&section=${sectionSelect.value}`,
    );

    renderResult(data);
  } catch (error) {
    console.log(error);

    showToast("Unable to load result", "error");
  }
}

function renderResult(data) {
  const head = document.getElementById("tableHead");

  const body = document.getElementById("resultTable");

  head.innerHTML = "";

  body.innerHTML = "";

  // ---------- Header ----------

  let header = `

    <tr>

      <th>Roll</th>

      <th>Admission No</th>

      <th>Student</th>

  `;

  data.subjects.forEach((subject) => {
    header += `<th>${subject.subjectName}</th>`;
  });

  header += `

      <th>Total</th>

      <th>Percentage</th>

      <th>Action</th>

    </tr>

  `;

  head.innerHTML = header;

  // ---------- Body ----------

  data.students.forEach((student) => {
    let row = `

      <tr>

        <td>${student.rollNo}</td>

        <td>${student.admissionNo}</td>

        <td>${student.name}</td>

    `;

    student.subjects.forEach((subject) => {
      row += `<td>${subject.marks}</td>`;
    });

    row += `

      <td>

        ${student.total} / ${data.maximumTotal}

      </td>

      <td>

        ${student.percentage}%

      </td>

      <td>

        <button
          class="print-btn"
          onclick="printReport('${student.enrollmentId}')">

          🖨 Print

        </button>

      </td>

      </tr>

    `;

    body.innerHTML += row;
  });
}

function printReport(studentEnrollment) {
  const session = sessionSelect.value;

  const exam = examSelect.value;

  window.open(
    `../results/report-card.html?session=${session}&studentEnrollment=${studentEnrollment}&exam=${exam}`,
    "_blank",
  );
}

function printEntireClass() {
  const session = sessionSelect.value;

  const exam = examSelect.value;

  const classId = classSelect.value;

  const section = sectionSelect.value;

  if (!session || !exam || !classId || !section) {
    showToast("Please select Session, Exam, Class and Section", "error");

    return;
  }

  window.open(
    `../results/class-report.html?session=${session}&exam=${exam}&class=${classId}&section=${section}`,

    "_blank",
  );
}