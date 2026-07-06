const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

async function loadDashboard() {
  try {
    const [
      teachers,
      students,
      subjects,
      exams,
      sessions,
      classes,
      enrollments,
    ] = await Promise.all([
      API.get("/api/teachers"),
      API.get("/api/students"),
      API.get("/api/subjects"),
      API.get("/api/exams"),
      API.get("/api/sessions"),
      API.get("/api/classes"),
      API.get("/api/enrollments"),
    ]);

    document.getElementById("teacherCount").textContent =
      teachers.total ?? teachers.teachers.length;

    document.getElementById("studentCount").textContent =
      students.total ?? students.students.length;

    document.getElementById("subjectCount").textContent =
      subjects.total ?? subjects.subjects.length;

    document.getElementById("examCount").textContent =
      exams.total ?? exams.exams.length;

    document.getElementById("classCount").textContent =
      classes.total ?? classes.classes.length;

    document.getElementById("enrollmentCount").textContent =
      enrollments.total ?? enrollments.enrollments.length;

    if (sessions.sessions && sessions.sessions.length > 0) {
      document.getElementById("currentSession").textContent =
        sessions.sessions[0].sessionName;
    }

    document.getElementById("todayDate").textContent =
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  } catch (error) {
    console.error("Dashboard Error:", error);
  }
}

loadDashboard();
