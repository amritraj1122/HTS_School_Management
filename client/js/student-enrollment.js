// ---------------- Modal ----------------

async function openModal() {
  document.getElementById("enrollmentModal").style.display = "block";

  await DropdownService.loadSessions("session");

  await DropdownService.loadClasses("class");

  document.getElementById("student").value = "";
  document.getElementById("studentSearch").value = "";
  document.getElementById("studentResults").innerHTML = "";

  document.getElementById("session").value = "";
  document.getElementById("class").value = "";

  document.getElementById("section").innerHTML =
    '<option value="">Select Section</option>';

  document.getElementById("rollNo").value = "";

  const saveBtn = document.getElementById("saveBtn");

  saveBtn.textContent = "Save";
  saveBtn.onclick = createEnrollment;
}

function closeModal() {
  document.getElementById("enrollmentModal").style.display = "none";
}

// ---------------- Student Search ----------------

const studentSearch = document.getElementById("studentSearch");
const studentResults = document.getElementById("studentResults");

let searchTimeout;

studentSearch.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  const query = studentSearch.value.trim();

  document.getElementById("student").value = "";

  if (!query) {
    studentResults.innerHTML = "";
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const data = await API.get(
        `/api/students/search?query=${encodeURIComponent(query)}`,
      );

      studentResults.innerHTML = "";

      if (!data.students || data.students.length === 0) {
        studentResults.innerHTML =
          '<div class="student-result-empty">No student found</div>';

        return;
      }

      data.students.forEach((student) => {
        const result = document.createElement("div");

        result.className = "student-result-item";

        result.innerHTML = `
          <strong>${student.admissionNo}</strong> - ${student.name}
          <br>
          <small>Father: ${student.fatherName}</small>
        `;

        result.addEventListener("click", () => {
          document.getElementById("student").value = student._id;

          studentSearch.value = `${student.admissionNo} - ${student.name}`;

          studentResults.innerHTML = "";
        });

        studentResults.appendChild(result);
      });
    } catch (error) {
      console.log(error);

      studentResults.innerHTML =
        '<div class="student-result-empty">Unable to search students</div>';
    }
  }, 300);
});

// ---------------- Modal Class Change ----------------

document.getElementById("class").addEventListener("change", async function () {
  await DropdownService.loadSections("section", this.value);
});

// =====================================================
// FILTERS
// =====================================================

const filterClass = document.getElementById("filterClass");
const filterSection = document.getElementById("filterSection");

initializeFilters();

async function initializeFilters() {
  await DropdownService.loadClasses("filterClass");

  filterClass.insertAdjacentHTML(
    "afterbegin",
    '<option value="">All Classes</option>',
  );

  filterSection.innerHTML = '<option value="">All Sections</option>';
}

filterClass.addEventListener("change", async () => {
  filterSection.innerHTML = '<option value="">All Sections</option>';

  if (filterClass.value) {
    await DropdownService.loadSections("filterSection", filterClass.value);

    filterSection.insertAdjacentHTML(
      "afterbegin",
      '<option value="">All Sections</option>',
    );
  }

  loadEnrollments();
});

filterSection.addEventListener("change", loadEnrollments);

// =====================================================
// LOAD ENROLLMENTS
// =====================================================

async function loadEnrollments() {
  try {
    let url = "/api/enrollments";

    const params = [];

    if (filterClass.value) {
      params.push(`class=${filterClass.value}`);
    }

    if (filterSection.value) {
      params.push(`section=${filterSection.value}`);
    }

    if (params.length) {
      url += "?" + params.join("&");
    }

    const data = await API.get(url);

    const table = document.getElementById("enrollmentTable");

    table.innerHTML = "";

    data.enrollments.forEach((item) => {
      table.innerHTML += `
        <tr>

          <td>${item.rollNo}</td>

          <td>${item.student.admissionNo}</td>

          <td>${item.student.name}</td>

          <td>${item.session.sessionName}</td>

          <td>${item.class.className}</td>

          <td>${item.section}</td>

          <td>

            <button onclick="editEnrollment('${item._id}')">
              Edit
            </button>

            <button onclick="deleteEnrollment('${item._id}')">
              Delete
            </button>

          </td>

        </tr>
      `;
    });
  } catch (error) {
    console.log(error);

    showToast("Unable to load enrollments", "error");
  }
}

loadEnrollments();

// =====================================================
// CREATE
// =====================================================

async function createEnrollment() {
  try {
    const response = await API.post("/api/enrollments/create", {
      student: document.getElementById("student").value,
      session: document.getElementById("session").value,
      class: document.getElementById("class").value,
      section: document.getElementById("section").value,
      rollNo: document.getElementById("rollNo").value,
    });

    showToast(response.message);

    closeModal();

    loadEnrollments();
  } catch (error) {
    console.log(error);

    showToast("Unable to create enrollment", "error");
  }
}

// =====================================================
// DELETE
// =====================================================

async function deleteEnrollment(id) {
  if (!confirm("Delete Enrollment?")) return;

  try {
    const response = await API.delete(`/api/enrollments/${id}`);

    showToast(response.message);

    loadEnrollments();
  } catch (error) {
    console.log(error);

    showToast("Unable to delete enrollment", "error");
  }
}

// =====================================================
// EDIT
// =====================================================

async function editEnrollment(id) {
  try {
    await openModal();

    const data = await API.get(`/api/enrollments/${id}`);

    const enrollment = data.enrollment;
    
    document.getElementById("student").value = enrollment.student._id;
    document.getElementById("studentSearch").value =
      `${enrollment.student.admissionNo} - ${enrollment.student.name}`;
    document.getElementById("session").value = enrollment.session._id;
    document.getElementById("class").value = enrollment.class._id;

    await DropdownService.loadSections("section", enrollment.class._id);

    document.getElementById("section").value = enrollment.section;
    document.getElementById("rollNo").value = enrollment.rollNo;

    const saveBtn = document.getElementById("saveBtn");

    saveBtn.textContent = "Update Enrollment";

    saveBtn.onclick = function () {
      updateEnrollment(id);
    };
  } catch (error) {
    console.log(error);

    showToast("Unable to load enrollment", "error");
  }
}

// =====================================================
// UPDATE
// =====================================================

async function updateEnrollment(id) {
  try {
    const response = await API.put(`/api/enrollments/${id}`, {
      student: document.getElementById("student").value,
      session: document.getElementById("session").value,
      class: document.getElementById("class").value,
      section: document.getElementById("section").value,
      rollNo: document.getElementById("rollNo").value,
    });

    showToast(response.message);

    closeModal();

    loadEnrollments();

    document.getElementById("saveBtn").textContent = "Save";

    document.getElementById("saveBtn").onclick = createEnrollment;
  } catch (error) {
    console.log(error);

    showToast("Unable to update enrollment", "error");
  }
}
