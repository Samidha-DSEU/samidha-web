document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // 🔹 Modal Functions
  // ======================
  function openModal(img) {
    const modal = document.getElementById("artModal");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("modalCaption");

    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.getAttribute('data-description');
  }

  function closeModal() {
    document.getElementById("artModal").style.display = "none";
  }

  window.onclick = function (event) {
    const modal = document.getElementById("artModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Expose globally
  window.openModal = openModal;
  window.closeModal = closeModal;


  // ======================
  // 🔹 Image Slider Logic
  // ======================
  let index = 0;
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  function showSlide(i) {
    index = (i + totalSlides) % totalSlides; // wrap around
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  // Next / Prev Buttons
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(index + 1);
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(index - 1);
    });
  }

  // Initialize
  showSlide(index);
});
