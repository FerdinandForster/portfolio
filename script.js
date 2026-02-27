// Active Link Highlighting
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#myLinks .link-btn");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Menu Toggle Functionality
function toggleMenu() {
  const menu = document.getElementById("myLinks");
  const header = document.querySelector("header");
  const profile = document.querySelector(".profile-info");

  menu.classList.toggle("is-open");
  header.classList.toggle("menu-open");
  profile.classList.toggle("hidden");
}

// Accordion Functionality (inkl. aria-expanded + aria-hidden)
document.querySelectorAll('.accordion').forEach((accordion) => {
  accordion.addEventListener('click', function () {
    const panel = this.nextElementSibling;
    const isOpen = this.getAttribute('aria-expanded') === 'true';

    this.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('show', !isOpen);
    panel.setAttribute('aria-hidden', String(isOpen));
  });
});


// =======================
// MODAL (Lazy Loaded)
// =======================
const modal = document.getElementById("ProjectModal");
const modalTitle = document.getElementById("ProjectModalTitle");
const modalBody = document.getElementById("ProjectModalBody");

function openModal() {
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";

  // stoppt Medien/entlastet DOM
  modalTitle.textContent = "";
  modalBody.innerHTML = "";
}

async function loadModalContent(src) {
  modalBody.innerHTML = "<p>Lädt …</p>";

  try {
    const res = await fetch(src, { cache: "force-cache" });
    if (!res.ok) {
      modalBody.innerHTML = "<p>Fehler beim Laden.</p>";
      return;
    }

    modalBody.innerHTML = await res.text();

    // Nach dem Einfügen: Carousel im Modal initialisieren (falls vorhanden)
    initCarouselInside(modalBody);
  } catch (e) {
    modalBody.innerHTML = "<p>Fehler beim Laden.</p>";
  }
}

// Cards -> Modal öffnen + Inhalt nachladen
document.querySelectorAll(".project-card[data-modal-src]").forEach((card) => {
  card.addEventListener("click", () => {
    openModal(); // sofort Popup öffnen
    modalTitle.textContent = card.dataset.modalTitle || "";
    loadModalContent(card.dataset.modalSrc); // Inhalt asynchron nachladen
  });
});

// Close Button im Modal
modal.querySelector(".close").addEventListener("click", closeModal);

// Klick außerhalb schließt
window.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

// ESC schließt
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.style.display === "block") closeModal();
});


// =======================
// Filter Functionality
// =======================
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      if (filterValue === "all") {
        card.classList.remove("hidden");
      } else {
        const cardCategory = card.getAttribute("data-category");
        if (cardCategory === filterValue) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      }
    });
  });
});


// =======================
// Theme: Auto (System) default + manual override
// =======================
function applyTheme(mode) {
  const root = document.documentElement;

  if (mode === "auto") {
    root.removeAttribute("data-theme");
    localStorage.removeItem("themeMode");
  } else {
    root.setAttribute("data-theme", mode);
    localStorage.setItem("themeMode", mode);
  }

  updateThemeButtons(mode);
}

function getCurrentMode() {
  return localStorage.getItem("themeMode") || "auto";
}

function updateThemeButtons(mode) {
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.theme === mode ? "true" : "false");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const mode = getCurrentMode();
  applyTheme(mode);

  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getCurrentMode() === "auto") {
      document.documentElement.removeAttribute("data-theme");
      updateThemeButtons("auto");
    }
  });
});


// =======================
// Carousel init (nur im geladenen Modal-Inhalt)
// =======================
function initCarouselInside(scope) {
  const track = scope.querySelector('#carouselTrack');
  const prevButton = scope.querySelector('#prevButton');
  const nextButton = scope.querySelector('#nextButton');
  const slides = scope.querySelectorAll('.carousel__slide');

  if (!track || !prevButton || !nextButton || slides.length === 0) return;

  let currentIndex = 0;

  function updateButtons() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
  }

  function scrollToSlide(index) {
    const slideWidth = slides[0].offsetWidth;
    const gap = 16;
    track.scrollLeft = index * (slideWidth + gap);
    currentIndex = index;
    updateButtons();
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) scrollToSlide(currentIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) scrollToSlide(currentIndex + 1);
  });

  track.addEventListener('scroll', () => {
    const slideWidth = slides[0].offsetWidth;
    const gap = 16;
    currentIndex = Math.round(track.scrollLeft / (slideWidth + gap));
    updateButtons();
  });

  updateButtons();
}