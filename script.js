//Navigation
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

//Accordion
const accordions = document.querySelectorAll('.accordion');

        accordions.forEach(accordion => {
            accordion.addEventListener('click', function() {
                this.classList.toggle('active');
                
                const panel = this.nextElementSibling;
                
                if (panel.classList.contains('show')) {
                    panel.classList.remove('show');
                } else {
                    panel.classList.add('show');
                }
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
        const cardCategory = card
          .querySelector(".tag")
          .getAttribute("data-category");
        if (cardCategory === filterValue) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      }
    });

    // Update carousel buttons after filtering
    updateButtons();
  });
});
