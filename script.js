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