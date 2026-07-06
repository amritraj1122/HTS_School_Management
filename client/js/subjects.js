const table = document.getElementById("subjectTable");
const searchBox = document.getElementById("searchSubject");
const modal = document.getElementById("subjectModal");
const addBtn = document.querySelector(".addBtn");
const closeBtn = document.querySelector(".close");
const subjectForm = document.getElementById("subjectForm");

let allSubjects = [];
let editingSubjectId = null;

// ---------------- Render ----------------

function renderSubjects(subjects) {
  table.innerHTML = "";

  subjects.forEach((subject) => {
    table.innerHTML += `
      <tr>

        <td>${subject.subjectCode}</td>

        <td>${subject.subjectName}</td>

        <td>${subject.class}</td>

        <td>${subject.fullMarks}</td>

        <td>${subject.passingMarks}</td>

        <td>

          <button
            class="editBtn"
            onclick="editSubject('${subject._id}')">

            Edit

          </button>

          <button
            class="deleteBtn"
            onclick="deleteSubject('${subject._id}')">

            Delete

          </button>

        </td>

      </tr>
    `;
  });
}

// ---------------- Load ----------------

async function loadSubjects() {
  try {
    const response = await fetch("/api/subjects");

    const data = await response.json();

    allSubjects = data.subjects;

    renderSubjects(allSubjects);
  } catch (error) {
    console.log(error);

    showToast("Unable to load subjects", "error");
  }
}

loadSubjects();

// ---------------- Modal ----------------

addBtn.onclick = () => {
  editingSubjectId = null;

  subjectForm.reset();

  document.querySelector("#subjectForm button").textContent = "Save Subject";

  modal.style.display = "flex";
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// ---------------- Save / Update ----------------

subjectForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const subject = {
    subjectCode: document.getElementById("subjectCode").value.trim(),

    subjectName: document.getElementById("subjectName").value.trim(),

    class: document.getElementById("class").value,

    fullMarks: Number(document.getElementById("fullMarks").value),

    passingMarks: Number(document.getElementById("passingMarks").value),

    active: true,
  };

  let url = "/api/subjects/create";

  let method = "POST";

  if (editingSubjectId) {
    url = `/api/subjects/${editingSubjectId}`;

    method = "PUT";
  }

  try {
    const response = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(subject),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message, "error");

      return;
    }

    showToast(data.message);

    subjectForm.reset();

    editingSubjectId = null;

    document.querySelector("#subjectForm button").textContent = "Save Subject";

    modal.style.display = "none";

    loadSubjects();
  } catch (error) {
    console.log(error);

    showToast("Unable to save subject", "error");
  }
});

// ---------------- Edit ----------------

function editSubject(id) {
  const subject = allSubjects.find((item) => item._id === id);

  if (!subject) return;

  editingSubjectId = id;

  document.getElementById("subjectCode").value = subject.subjectCode;

  document.getElementById("subjectName").value = subject.subjectName;

  document.getElementById("class").value = subject.class;

  document.getElementById("fullMarks").value = subject.fullMarks;

  document.getElementById("passingMarks").value = subject.passingMarks;

  document.querySelector("#subjectForm button").textContent = "Update Subject";

  modal.style.display = "flex";
}

// ---------------- Delete ----------------

async function deleteSubject(id) {
  if (!confirm("Delete Subject?")) return;

  try {
    const response = await fetch(`/api/subjects/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    showToast(data.message);

    loadSubjects();
  } catch (error) {
    console.log(error);

    showToast("Unable to delete subject", "error");
  }
}

// ---------------- Search ----------------

searchBox.addEventListener("keyup", () => {
  const value = searchBox.value.toLowerCase();

  const filtered = allSubjects.filter(
    (subject) =>
      subject.subjectCode.toLowerCase().includes(value) ||
      subject.subjectName.toLowerCase().includes(value) ||
      subject.class.toLowerCase().includes(value),
  );

  renderSubjects(filtered);
});
