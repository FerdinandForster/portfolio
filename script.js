
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
//Carousel
const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let isDragging = false;
    let startPos = 0;
    let prevTranslate = 0;

    // Touch Events
    carousel.addEventListener('touchstart', startDrag);
    carousel.addEventListener('touchmove', drag);
    carousel.addEventListener('touchend', endDrag);

    // Scroll Event
    carousel.addEventListener('scroll', updateButtons);

    function startDrag(e) {
      isDragging = true;
      carousel.classList.add('grabbing');
      startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      startPos -= carousel.offsetLeft;
      prevTranslate = carousel.scrollLeft;
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      const x = currentPosition - carousel.offsetLeft;
      const walk = (x - startPos) * 2;
      carousel.scrollLeft = prevTranslate - walk;
    }

    function endDrag() {
      isDragging = false;
      carousel.classList.remove('grabbing');
    }

    // Arrow Navigation
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -360, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 360, behavior: 'smooth' });
    });

    function updateButtons() {
      const scrollLeft = carousel.scrollLeft;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      
      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= maxScroll - 1;
    }

    updateButtons();


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

