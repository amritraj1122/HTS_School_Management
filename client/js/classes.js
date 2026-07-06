const table = document.getElementById("classTable");
const classForm = document.getElementById("classForm");
const searchBox = document.getElementById("searchClass");
const modal = document.getElementById("classModal");
const addBtn = document.querySelector(".addBtn");
const closeBtn = document.querySelector(".close");

let allClasses = [];

let editingClassId = null;

initializeModal("classModal");
async function loadClasses() {
  try {
    const data = await API.get("/api/classes");

    allClasses = data.classes;

    renderClasses(allClasses);
  } catch (error) {
    console.log(error);

    showToast("Unable to load classes", "error");
  }
}
function renderClasses(classes) {
  table.innerHTML = "";

  classes.forEach((classItem) => {
    table.innerHTML += `

        <tr>

            <td>${classItem.className}</td>

            <td>${classItem.classOrder}</td>

            <td>${classItem.sections.join(", ")}</td>

            <td>

                ${classItem.active ? "Active" : "Inactive"}

            </td>

            <td>

                <button
                    class="editBtn"
                    onclick="editClass('${classItem._id}')">

                    Edit

                </button>

                <button
                    class="deleteBtn"
                    onclick="deleteClass('${classItem._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;
  });
}
loadClasses();

async function editClass(id) {
  try {
    const data = await API.get(`/api/classes/${id}`);

    const classData = data.class;

    editingClassId = id;

    document.getElementById("className").value = classData.className;

    document.getElementById("classOrder").value = classData.classOrder;

    // Uncheck all checkboxes
    document.querySelectorAll(".section-group input").forEach((check) => {
      check.checked = false;
    });

    // Check selected sections
    classData.sections.forEach((section) => {
      const checkbox = document.querySelector(
        `.section-group input[value="${section}"]`,
      );

      if (checkbox) checkbox.checked = true;
    });

    document.querySelector("#classForm button").textContent = "Update Class";

    modal.style.display = "flex";
  } catch (error) {
    console.log(error);

    showToast("Unable to load class", "error");
  }
}

async function deleteClass(id) {
  const ok = await showConfirm("Delete this class?");

  if (!ok) return;

  try {
    const data = await API.delete(`/api/classes/${id}`);

    if (data.success) {
      showToast(data.message, "success");

      loadClasses();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Unable to delete class", "error");
  }
}

addBtn.addEventListener("click", () => {
  classForm.reset();

  editingClassId = null;

  document.querySelector("#classForm button").textContent = "Save Class";

  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
classForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const sections = [];

  document
    .querySelectorAll(".section-group input:checked")
    .forEach((check) => sections.push(check.value));

  const classData = {
    className: document.getElementById("className").value,

    classOrder: Number(document.getElementById("classOrder").value),

    sections,
  };

  try {
    let data;

    if (editingClassId) {
      data = await API.put(
        `/api/classes/${editingClassId}`,

        classData,
      );
    } else {
      data = await API.post(
        "/api/classes/create",

        classData,
      );
    }

    if (data.success) {
      showToast(data.message, "success");

      modal.style.display = "none";

      classForm.reset();

      editingClassId = null;

      loadClasses();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");
  }
});

searchBox.addEventListener("input", () => {

    const keyword = searchBox.value.toLowerCase();

    const filteredClasses = allClasses.filter(classItem =>

        classItem.className.toLowerCase().includes(keyword)

    );

    renderClasses(filteredClasses);

});