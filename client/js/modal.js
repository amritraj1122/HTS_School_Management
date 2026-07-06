function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.style.display = "flex";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.style.display = "none";
}

function initializeModal(modalId, closeSelector = ".close") {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  const closeBtn = modal.querySelector(closeSelector);

  if (closeBtn) {
    closeBtn.onclick = () => closeModal(modalId);
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modalId);
    }
  });
}
