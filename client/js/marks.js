const params = new URLSearchParams(window.location.search);
const examId = params.get("exam");
const assignmentId = params.get("assignment");
const studentTable = document.getElementById("studentTable");
const saveBtn = document.getElementById("saveBtn");

let maximumMarks = 0;
let hasUnsavedChanges = false;

if (!examId || !assignmentId) {
  showToast("Invalid Request", "error");

  throw new Error("Missing URL Parameters");
}
async function loadStudents() {
  try {
    const data = await API.get(
      `/api/marks/load?exam=${examId}&assignment=${assignmentId}`,
    );

    maximumMarks = data.exam.maxMarks;

    renderStudents(data);
  } catch (error) {
    console.log(error);

    showToast("Unable to load students", "error");
  }
}

loadStudents();
function renderStudents(data) {
  studentTable.innerHTML = "";
  document.getElementById("assignmentInfo").innerHTML = `
    <h2>${data.assignment.subject}</h2>

    <p><strong>Exam:</strong> ${data.exam.name}</p>
    <p><strong>Maximum Marks:</strong> ${data.exam.maxMarks}</p>

    <p><strong>Class:</strong> ${data.assignment.class} - ${data.assignment.section}</p>
`;

  data.students.forEach((student) => {
    studentTable.innerHTML += `

<tr>

<td>${student.rollNo}</td>

<td>${student.name}</td>

<td>

<input

type="number"
class="marks-input"
data-id="${student.enrollmentId}"
value="${student.marks}"

>

</td>

<td>

<input

type="checkbox"
class="absent-checkbox"
${student.absent ? "checked" : ""}

>

</td>


</tr>

`;
  });

  document.querySelectorAll(".marks-input").forEach((input) => {
    input.addEventListener("input", validateMarks);

    input.addEventListener("keydown", moveToNextInput);
  });
  document.querySelectorAll(".absent-checkbox").forEach(toggleAbsent);
}
saveBtn.addEventListener("click", saveMarks);

async function saveMarks() {
  saveBtn.disabled = true;

  saveBtn.textContent = "Saving...";
  const inputs = document.querySelectorAll(".marks-input");

  const marks = [];

  inputs.forEach((input) => {
    const row = input.closest("tr");

    const absent = row.querySelector(".absent-checkbox").checked;

    marks.push({
      studentEnrollment: input.dataset.id,

      marksObtained: absent ? 0 : Number(input.value) || 0,

      absent,
    });
  });

  try {
    const response = await API.post(
      "/api/marks/save",

      {
        exam: examId,
        assignment: assignmentId,
        marks,
      },
    );

    showToast(response.message);
    await loadStudents();
    saveBtn.disabled = false;
    hasUnsavedChanges = false;

    saveBtn.textContent = "Save Marks";
  } catch (error) {
    saveBtn.disabled = false;

    saveBtn.textContent = "Save Marks";
    console.log(error);

    showToast("Unable to save marks", "error");
  }
}
function validateMarks(event) {
  const input = event.target;

  const value = Number(input.value);

  if (value > maximumMarks) {
    input.style.border = "2px solid red";

    showToast(`Maximum marks is ${maximumMarks}`, "error");

    input.value = "";

    return;
  }

  input.style.border = "";
  hasUnsavedChanges = true;
}
function moveToNextInput(event) {
  if (event.key !== "Enter") return;

  event.preventDefault();

  const inputs = [...document.querySelectorAll(".marks-input")];

  const index = inputs.indexOf(event.target);

  if (index < inputs.length - 1) {
    inputs[index + 1].focus();

    inputs[index + 1].select();
  }
}
function toggleAbsent(checkbox) {
  const row = checkbox.closest("tr");

  const marksInput = row.querySelector(".marks-input");

  function updateState() {
    if (checkbox.checked) {
      marksInput.value = "";

      marksInput.disabled = true;

      marksInput.classList.add("disabled-input");
    } else {
      marksInput.disabled = false;

      marksInput.classList.remove("disabled-input");
    }

    hasUnsavedChanges = true;
  }

  // Apply state when page loads
  updateState();

  // Apply state whenever checkbox changes
  checkbox.addEventListener("change", updateState);
}
window.addEventListener("beforeunload", function (event) {
  if (!hasUnsavedChanges) return;

  event.preventDefault();

  event.returnValue = "";
});
