// ===============================
// Global Loader
// ===============================

(function () {
  const loader = document.createElement("div");

  loader.id = "globalLoader";

  loader.innerHTML = `

    <div class="loader-box">

      <img
        src="/assets/images/logo.png"
        class="loader-logo"
        alt="School Logo">

      <div class="loader-title">

        HOLY TRINITY SCHOOL

      </div>

      <div class="loader-spinner"></div>

      <div class="loader-text">

        Loading...

      </div>

    </div>

  `;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(loader);
  });

  window.showLoader = function () {
    loader.classList.add("show");
  };

  window.hideLoader = function () {
    loader.classList.remove("show");
  };
})();
