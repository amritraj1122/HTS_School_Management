async function openModal() {
  await DropdownService.loadSessions("session");

  document.getElementById("examModal").style.display = "block";
}

function closeModal() {
  document.getElementById("examModal").style.display = "none";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

async function loadExams() {
  try {
    const data = await API.get("/api/exams");

    const table = document.getElementById("examTable");

    table.innerHTML = "";

    data.exams.forEach((exam) => {
      table.innerHTML += `

<tr>

<td>${exam.examCode}</td>

<td>${exam.examName}</td>

<td>${exam.maxMarks}</td>

<td>${exam.displayOrder}</td>

<td>${exam.active ? "Active" : "Inactive"}</td>

<td>

<button onclick="editExam('${exam._id}')">

Edit

</button>

<button onclick="deleteExam('${exam._id}')">

Delete

</button>

</td>

</tr>

`;
    });
  } catch (error) {
    console.log(error);

    showToast("Unable to load exams", "error");
  }
}

loadExams();

async function createExam() {
  try {
    const response = await API.post("/api/exams/create", {
      session: document.getElementById("session").value,

      examCode: document.getElementById("examCode").value,

      examName: document.getElementById("examName").value,

      maxMarks: document.getElementById("maxMarks").value,

      displayOrder: document.getElementById("displayOrder").value,
      resultType: document.getElementById("resultType").value,

      active: document.getElementById("active").value === "true",
    });

    showToast(response.message);

    closeModal();

    loadExams();
  } catch (error) {
    console.log(error);

    showToast("Unable to create exam", "error");
  }
}

async function deleteExam(id) {
  if (!confirm("Delete Exam?")) return;

  try {
    const response = await API.delete(`/api/exams/${id}`);

    showToast(response.message);

    loadExams();
  } catch (error) {
    console.log(error);

    showToast("Unable to delete exam", "error");
  }
}

async function editExam(id) {
  const data = await API.get("/api/exams");

  const exam = data.exams.find((e) => e._id === id);

  document.getElementById("editId").value = exam._id;

  document.getElementById("editExamCode").value = exam.examCode;

  document.getElementById("editExamName").value = exam.examName;

  document.getElementById("editMaxMarks").value = exam.maxMarks;

  document.getElementById("editDisplayOrder").value = exam.displayOrder;

  await DropdownService.loadSessions("editSession");

  document.getElementById("editSession").value = exam.session._id;

  document.getElementById("editActive").value = exam.active.toString();

  document.getElementById("editModal").style.display = "block";
}

async function updateExam() {
  try {
    const id = document.getElementById("editId").value;

    const response = await API.put(`/api/exams/${id}`, {
      session: document.getElementById("editSession").value,

      examCode: document.getElementById("editExamCode").value,

      examName: document.getElementById("editExamName").value,

      maxMarks: document.getElementById("editMaxMarks").value,

      displayOrder: document.getElementById("editDisplayOrder").value,
      resultType: document.getElementById("editResultType").value,

      active: document.getElementById("editActive").value === "true",
    });

    showToast(response.message);

    closeEditModal();

    loadExams();
  } catch (error) {
    console.log(error);

    showToast("Unable to update exam", "error");
  }
}
