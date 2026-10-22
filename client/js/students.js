const table = document.getElementById("studentTable");
const searchBox = document.getElementById("searchStudent");

let allStudents = [];
let editingStudentId = null;

// ---------------- Render Students ----------------

function renderStudents(students) {
  table.innerHTML = "";

  if (!students.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5">No students found.</td>
      </tr>
    `;
    return;
  }

  students.forEach((student) => {
    table.innerHTML += `
      <tr>
        <td>${student.admissionNo || ""}</td>
        <td>${student.name || ""}</td>
        <td>${student.fatherName || ""}</td>
        <td>${student.gender || ""}</td>
        <td>
          <button
            class="editBtn"
            onclick="editStudent('${student._id}')">
            Edit
          </button>

          <button
            class="deleteBtn"
            onclick="deleteStudent('${student._id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// ---------------- Load Students ----------------

async function loadStudents() {
  try {
    const response = await fetch("/api/students");
    const data = await response.json();

    if (!response.ok || (!data.success && !Array.isArray(data.students))) {
      throw new Error(data.message || "Unable to load students.");
    }

    allStudents = data.students || [];
    filterStudents();
  } catch (error) {
    console.error("Load Students Error:", error);
    showToast("Unable to load students", "error");
  }
}

loadStudents();

// ---------------- Edit Student ----------------

function editStudent(id) {
  const student = allStudents.find((item) => item._id === id);

  if (!student) {
    showToast("Student not found", "error");
    return;
  }

  editingStudentId = id;

  document.getElementById("name").value = student.name || "";
  document.getElementById("fatherName").value = student.fatherName || "";
  document.getElementById("gender").value = student.gender || "Male";

  document.querySelector("#studentForm button[type='submit']").textContent =
    "Update Student";

  modal.style.display = "flex";
}

// ---------------- Delete Student ----------------

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) {
    return;
  }

  try {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to delete student.");
    }

    showToast("Student deleted successfully!");
    await loadStudents();
  } catch (error) {
    console.error("Delete Student Error:", error);
    showToast(error.message || "Unable to delete student", "error");
  }
}

// ---------------- Modal Elements ----------------

const modal = document.getElementById("studentModal");
const addBtn = document.querySelector("#addBtn");
const closeBtn = document.querySelector(".close");

initializeModal("studentModal");

// Open Modal

addBtn.onclick = () => {
  editingStudentId = null;
  studentForm.reset();

  document.querySelector("#studentForm button[type='submit']").textContent =
    "Save Student";

  openModal("studentModal");
};

// Close Modal

closeBtn.onclick = () => {
  closeModal("studentModal");
};

// Close When Clicking Outside

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal("studentModal");
  }
});

// ---------------- Create / Update Student ----------------

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const student = {
    name: document.getElementById("name").value.trim(),
    fatherName: document.getElementById("fatherName").value.trim(),
    gender: document.getElementById("gender").value,
  };

  if (!student.name || !student.fatherName || !student.gender) {
    showToast("Please fill in all student details.", "error");
    return;
  }

  const isEditing = editingStudentId !== null;

  const url = isEditing
    ? `/api/students/${editingStudentId}`
    : "/api/students/create";

  try {
    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to save student.");
    }

    showToast(
      isEditing
        ? "Student updated successfully!"
        : "Student added successfully!",
    );

    studentForm.reset();
    editingStudentId = null;

    document.querySelector("#studentForm button[type='submit']").textContent =
      "Save Student";

    closeModal("studentModal");

    await loadStudents();
  } catch (error) {
    console.error("Save Student Error:", error);
    showToast(error.message || "Unable to save student", "error");
  }
});

// ---------------- Search Students ----------------

function filterStudents() {
  const keyword = searchBox.value.trim().toLowerCase();

  const filtered = allStudents.filter((student) => {
    return (
      (student.admissionNo || "").toLowerCase().includes(keyword) ||
      (student.name || "").toLowerCase().includes(keyword) ||
      (student.fatherName || "").toLowerCase().includes(keyword)
    );
  });

  renderStudents(filtered);
}

searchBox.addEventListener("input", filterStudents);
