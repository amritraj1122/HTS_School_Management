const DropdownService = {
  async loadClasses(selectId) {
    const select = document.getElementById(selectId);

    if (!select) return;

    const data = await API.get("/api/classes");

    select.innerHTML = '<option value="">Select Class</option>';

    data.classes.forEach((item) => {
      select.innerHTML += `
                <option value="${item._id}">
                    ${item.className}
                </option>
            `;
    });
  },

  async loadSessions(selectId) {
    const select = document.getElementById(selectId);

    if (!select) return;

    const data = await API.get("/api/sessions");

    select.innerHTML = '<option value="">Select Session</option>';

    data.sessions.forEach((item) => {
      select.innerHTML += `
                <option value="${item._id}">
                    ${item.sessionName}
                </option>
            `;
    });
  },

  async loadSubjects(selectId, className = null) {
    const select = document.getElementById(selectId);

    if (!select) return;

    let url = "/api/subjects";

    if (className) {
      url += `?class=${encodeURIComponent(className)}`;
    }

    const data = await API.get(url);

    select.innerHTML = '<option value="">Select Subject</option>';

    data.subjects.forEach((item) => {
      select.innerHTML += `
                <option value="${item._id}">
                    ${item.subjectName}
                </option>
            `;
    });
  },

  async loadSections(selectId, classId) {
    const select = document.getElementById(selectId);

    if (!select) return;

    const data = await API.get("/api/classes");

    const classData = data.classes.find((item) => item._id === classId);

    select.innerHTML = '<option value="">Select Section</option>';

    if (!classData) return;

    classData.sections.forEach((section) => {
      select.innerHTML += `
                <option value="${section}">
                    ${section}
                </option>
            `;
    });
  },
  async loadExams(selectId) {
    const select = document.getElementById(selectId);

    if (!select) return;

    const data = await API.get("/api/exams");

    select.innerHTML = '<option value="">Select Exam</option>';

    data.exams.forEach((exam) => {
      select.innerHTML += `
            <option value="${exam._id}">
                ${exam.examName}
            </option>
        `;
    });
  },
};
