function openModal() {
  document.getElementById("teacherModal").style.display = "block";
}

function closeModal() {
  document.getElementById("teacherModal").style.display = "none";
}
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

async function loadTeachers() {
  try {
    const response = await fetch("https://hts-school-management.onrender.com/api/teachers");

    const data = await response.json();

    const table = document.getElementById("teacherTable");

    table.innerHTML = "";

    data.teachers.forEach((teacher) => {
      table.innerHTML += `

            <tr>

<td>${teacher.teacherId}</td>

<td>${teacher.name}</td>

<td>${teacher.email}</td>

<td>${teacher.mobile}</td>

<td>${teacher.active ? "Active" : "Inactive"}</td>

<td>

<button onclick="editTeacher('${teacher._id}')">
Edit
</button>

<button onclick="assignTeacher('${teacher._id}')">
Assign
</button>

<button onclick="deleteTeacher('${teacher._id}')">
Delete
</button>

</td>

            `;
    });
  } catch (error) {
    console.log(error);
  }
}

loadTeachers();

async function createTeacher() {
  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const mobile = document.getElementById("mobile").value;

  const active = document.getElementById("active").value === "true";

  const response = await fetch("https://hts-school-management.onrender.com/api/teachers/create", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,

      email,

      mobile,

      active,
    }),
  });

  const data = await response.json();

  alert(
    `Teacher Created

ID : ${data.teacherId}

Password : ${data.password}`,
  );

  closeModal();

  loadTeachers();
}

async function deleteTeacher(id) {
  if (!confirm("Delete Teacher?")) return;

  await fetch(
    `https://hts-school-management.onrender.com/api/teachers/${id}`,

    {
      method: "DELETE",
    },
  );

  loadTeachers();
}
async function editTeacher(id) {
  const response = await fetch("https://hts-school-management.onrender.com/api/teachers");

  const data = await response.json();

  const teacher = data.teachers.find((t) => t._id === id);

  document.getElementById("editId").value = teacher._id;

  document.getElementById("editName").value = teacher.name;

  document.getElementById("editEmail").value = teacher.email;

  document.getElementById("editMobile").value = teacher.mobile;

  document.getElementById("editActive").value = teacher.active.toString();

  document.getElementById("editModal").style.display = "block";
}

async function updateTeacher() {
  const id = document.getElementById("editId").value;

  const name = document.getElementById("editName").value;

  const email = document.getElementById("editEmail").value;

  const mobile = document.getElementById("editMobile").value;

  const active = document.getElementById("editActive").value === "true";

  await fetch(
    `https://hts-school-management.onrender.com/api/teachers/${id}`,

    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,

        email,

        mobile,

        active,
      }),
    },
  );

  closeEditModal();

  loadTeachers();
}
function assignTeacher(id) {

    window.location.href =
        `../assignments/assignments.html?teacher=${id}`;

}