const params = new URLSearchParams(window.location.search);

const teacherId = params.get("teacher");

const sessionSelect = document.getElementById("session");
const classSelect = document.getElementById("class");
const sectionSelect = document.getElementById("section");
const subjectSelect = document.getElementById("subject");

const assignmentTable = document.getElementById("assignmentTable");

const assignBtn = document.getElementById("assignBtn");

if (!teacherId) {
  showToast("Teacher not found", "error");

  throw new Error("Teacher ID Missing");
}
async function loadTeacher() {
  try {
    const data = await API.get(`/api/teachers/${teacherId}`);

    document.querySelector("h1").innerHTML = `
            Teaching Assignment<br>
            <small>${data.teacher.name}</small>
        `;
  } catch (error) {
    console.log(error);

    showToast("Unable to load teacher", "error");
  }
}
async function initializePage() {
  await loadTeacher();

  await DropdownService.loadSessions("session");

  await DropdownService.loadClasses("class");
  await loadAssignments();
}

initializePage();
classSelect.addEventListener("change", async () => {
  await DropdownService.loadSections(
    "section",

    classSelect.value,
  );

  const selectedClass = classSelect.options[classSelect.selectedIndex].text;

  await DropdownService.loadSubjects(
    "subject",

    selectedClass,
  );
});
async function loadAssignments() {
  try {
    const data = await API.get(`/api/assignments?teacher=${teacherId}`);

    renderAssignments(data.assignments);
  } catch (error) {
    console.log(error);

    showToast("Unable to load assignments", "error");
  }
}
function renderAssignments(assignments) {
  assignmentTable.innerHTML = "";

  assignments.forEach((item) => {
    assignmentTable.innerHTML += `

        <tr>

            <td>${item.class.className}</td>

            <td>${item.section}</td>

            <td>${item.subject.subjectName}</td>

            <td>

                <button
                  class="delete-btn"
                  onclick="deleteAssignment('${item._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;
  });
}
assignBtn.addEventListener("click", async () => {
  try {
    const response = await API.post(
      "/api/assignments/create",

      {
        teacher: teacherId,

        session: sessionSelect.value,

        class: classSelect.value,

        section: sectionSelect.value,

        subject: subjectSelect.value,

        active: true,
      },
    );

    showToast(response.message);

    loadAssignments();
  } catch (error) {
    console.log(error);

    showToast("Unable to create assignment", "error");
  }
});
async function deleteAssignment(id) {
  if (!confirm("Delete this assignment?")) return;

  try {
    const response = await API.delete(`/api/assignments/${id}`);

    showToast(response.message);

    loadAssignments();
  } catch (error) {
    console.log(error);

    showToast("Unable to delete assignment", "error");
  }
}
