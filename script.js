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
const accordions = document.querySelectorAll('.accordion');

accordions.forEach((accordion) => {
  accordion.addEventListener('click', function () {
    const panel = this.nextElementSibling;
    const isOpen = this.getAttribute('aria-expanded') === 'true';

    // toggle state
    this.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('show', !isOpen);
    panel.setAttribute('aria-hidden', String(isOpen));
  });
});


// Modal Functionality
// connect project-cards and modals
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    const modalId = card.id.replace("Btn", "Modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  });
});

// close-buttons
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal").style.display = "none";
    document.body.style.overflow = "auto";
  });
});

// closing if clicked outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
});






// Filter Functionality
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");

    // Update active button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Filter cards
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

// Theme: Auto (System) default + manual override
function applyTheme(mode) {
  const root = document.documentElement;

  if (mode === "auto") {
    root.removeAttribute("data-theme");     // folgt System
    localStorage.removeItem("themeMode");
  } else {
    root.setAttribute("data-theme", mode);  // "light" | "dark"
    localStorage.setItem("themeMode", mode);
  }

  updateThemeButtons(mode);
}


//slideshow-carousel
function getCurrentMode() {
  return localStorage.getItem("themeMode") || "auto";
}

function updateThemeButtons(mode) {
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.theme === mode ? "true" : "false");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // init
  const mode = getCurrentMode();
  applyTheme(mode);

  // clicks
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  // Wenn System wechselt: nur UI aktualisieren, wenn Auto aktiv ist
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getCurrentMode() === "auto") {
      document.documentElement.removeAttribute("data-theme"); // bleibt auto
      updateThemeButtons("auto");
    }
  });
});

const track = document.getElementById('carouselTrack');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const slides = document.querySelectorAll('.carousel__slide');

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
  if (currentIndex > 0) {
    scrollToSlide(currentIndex - 1);
  }
});

nextButton.addEventListener('click', () => {
  if (currentIndex < slides.length - 1) {
    scrollToSlide(currentIndex + 1);
  }
});

// Optional: Track scroll position to update button states
track.addEventListener('scroll', () => {
  const slideWidth = slides[0].offsetWidth;
  const gap = 16;
  currentIndex = Math.round(track.scrollLeft / (slideWidth + gap));
  updateButtons();
});

// Initialize button states
updateButtons();