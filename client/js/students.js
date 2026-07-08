const table = document.getElementById("studentTable");
const searchBox = document.getElementById("searchStudent");

let allStudents = [];
let editingStudentId = null;

function renderStudents(students) {
  table.innerHTML = "";

  students.forEach((student) => {
    table.innerHTML += `
      <tr>
        <td>${student.admissionNo}</td>
        <td>${student.name}</td>
        <td>${student.fatherName}</td>
        <td>${student.gender}</td>
        <td>${student.class}</td>
        <td>${student.section}</td>

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

async function loadStudents() {
  try {
    const response = await fetch("/api/students");

    const data = await response.json();

    allStudents = data.students;

    table.innerHTML = "";

    renderStudents(allStudents);
  } catch (err) {
    console.log(err);

    showToast("Unable to load students", "error");
  }
}

loadStudents();

function editStudent(id) {
  const student = allStudents.find((student) => student._id === id);

  if (!student) return;

  editingStudentId = id;

  document.getElementById("session").value = student.session;
  document.getElementById("name").value = student.name;
  document.getElementById("fatherName").value = student.fatherName;
  document.getElementById("gender").value = student.gender;
  document.getElementById("class").value = student.class;
  document.getElementById("section").value = student.section;

  document.querySelector("#studentForm button").textContent = "Update Student";

  modal.style.display = "flex";
}

async function deleteStudent(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?",
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      showToast("Student deleted successfully!");

      loadStudents();
    } else {
      showToast(data.message, "error");
    }
  } catch (err) {
    console.log(err);

    showToast("Unable to delete student", "error");
  }
}

// Modal Elements

const modal = document.getElementById("studentModal");

const addBtn = document.querySelector("#addBtn");

const closeBtn = document.querySelector(".close");

initializeModal("studentModal");

// Open Modal

addBtn.onclick = () => {
  openModal("studentModal");
};

// Close Modal

closeBtn.onclick = () => {
  closeModal("studentModal");
};

// Close on Background Click

window.onclick = (e) => {
  if (e.target === modal) {
    closeModal("studentModal");
  }
};

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    session: document.getElementById("session").value,
    name: document.getElementById("name").value,
    fatherName: document.getElementById("fatherName").value,
    gender: document.getElementById("gender").value,
    class: document.getElementById("class").value,
    section: document.getElementById("section").value,
  };

  try {
    let url = "/api/students/create";

    let method = "POST";

    if (editingStudentId !== null) {
      url = `/api/students/${editingStudentId}`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(student),
    });

    const data = await response.json();

    if (data.success) {
      showToast(
        editingStudentId
          ? "Student updated successfully!"
          : "Student added successfully!",
      );

      studentForm.reset();

      editingStudentId = null;

      document.querySelector("#studentForm button").textContent =
        "Save Student";

      closeModal("studentModal");

      loadStudents();
    } else {
      showToast(data.message, "error");
    }
  } catch (err) {
    console.log(err);

    showToast("Unable to save student", "error");
  }
});

// Search Box

searchBox.addEventListener("keyup", () => {
  const keyword = searchBox.value.toLowerCase();

  const filtered = allStudents.filter(
    (student) =>
      student.admissionNo.toLowerCase().includes(keyword) ||
      student.name.toLowerCase().includes(keyword) ||
      student.fatherName.toLowerCase().includes(keyword),
  );

  renderStudents(filtered);
});
