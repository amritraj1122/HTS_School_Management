const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const username = document.querySelector("#username").value.trim();

  const password = document.querySelector("#password").value;

  try {
    // ---------- Try Admin Login ----------

    let response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),
    });

    let data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("role", data.role);

      window.location.href = "admin.html";

      return;
    }

    // ---------- Try Teacher Login ----------

    response = await fetch("http://localhost:5000/api/teacher-auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        teacherId: username,
        password,
      }),
    });

    data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("role", data.role);

      localStorage.setItem("teacher", JSON.stringify(data.teacher));

      window.location.href = "/pages/teachers/dashboard.html";

      return;
    }

    document.getElementById("message").innerText =
      "Invalid Username / Teacher ID or Password";
  } catch (error) {
    console.log(error);
  }
});
