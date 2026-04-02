// =======================
// Active Link Highlighting
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("#myLinks .link-btn");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === currentPage);
  });
});


// =======================
// Menu Toggle
// =======================
function toggleMenu() {
  document.getElementById("myLinks").classList.toggle("is-open");
  document.querySelector("header").classList.toggle("menu-open");
  document.querySelector(".profile-info").classList.toggle("hidden");
}


// =======================
// Accordion
// =======================
document.querySelectorAll(".accordion").forEach(accordion => {
  accordion.addEventListener("click", function () {
    const panel = this.nextElementSibling;
    const isOpen = this.getAttribute("aria-expanded") === "true";

    this.setAttribute("aria-expanded", String(!isOpen));
    panel.classList.toggle("show", !isOpen);
    panel.setAttribute("aria-hidden", String(isOpen));
  });
});


// =======================
// Theme
// =======================
function applyTheme(mode) {
  if (mode === "auto") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("themeMode");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("themeMode", mode);
  }
  updateThemeButtons(mode);
}

function getCurrentMode() {
  return localStorage.getItem("themeMode") || "auto";
}

function updateThemeButtons(mode) {
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.theme === mode));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getCurrentMode());

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
// Modal (Lazy Loaded)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("ProjectModal");
  if (!modal) return; // Kein Modal auf dieser Seite → abbrechen

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
    document.body.style.overflow = "";
    modalTitle.textContent = "";
    modalBody.innerHTML = "";
  }

  async function loadModalContent(src) {
    modalBody.innerHTML = "<p>Lädt …</p>";
    try {
      const res = await fetch(src, { cache: "force-cache" });
      modalBody.innerHTML = res.ok ? await res.text() : "<p>Fehler beim Laden.</p>";
      if (res.ok) initCarouselInside(modalBody);
    } catch {
      modalBody.innerHTML = "<p>Fehler beim Laden.</p>";
    }
  }

  document.querySelectorAll(".project-card[data-modal-src]").forEach(card => {
    card.addEventListener("click", () => {
      openModal();
      modalTitle.textContent = card.dataset.modalTitle || "";
      loadModalContent(card.dataset.modalSrc);
    });
  });

  modal.querySelector(".close").addEventListener("click", closeModal);

  window.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape" && modal.style.display === "block") closeModal(); });
});


// =======================
// Filter
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter");

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach(card => {
        const match = filterValue === "all" || card.getAttribute("data-category") === filterValue;
        card.classList.toggle("hidden", !match);
      });

      setTimeout(() => {
        const track = document.getElementById("projectsTrack");
        if (track) {
          track.scrollLeft = 0;
          updateProjectsCarouselBtns?.();
        }
      }, 50);
    });
  });
});


// =======================
// Image-Carousel im Modal
// =======================
function initCarouselInside(scope) {
  const track = scope.querySelector("#carouselTrack");
  const prevButton = scope.querySelector("#prevButton");
  const nextButton = scope.querySelector("#nextButton");
  const slides = scope.querySelectorAll(".carousel__slide");

  if (!track || !prevButton || !nextButton || !slides.length) return;

  let currentIndex = 0;

  function updateButtons() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
  }

  function scrollToSlide(index) {
    track.scrollLeft = index * (slides[0].offsetWidth + 16);
    currentIndex = index;
    updateButtons();
  }

  prevButton.addEventListener("click", () => { if (currentIndex > 0) scrollToSlide(currentIndex - 1); });
  nextButton.addEventListener("click", () => { if (currentIndex < slides.length - 1) scrollToSlide(currentIndex + 1); });
  track.addEventListener("scroll", () => {
    currentIndex = Math.round(track.scrollLeft / (slides[0].offsetWidth + 16));
    updateButtons();
  });

  updateButtons();
}


// =======================
// Projects Carousel
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("projectsTrack");
  const prevBtn = document.getElementById("projectsPrev");
  const nextBtn = document.getElementById("projectsNext");
  if (!track || !prevBtn || !nextBtn) return;

  function getVisibleCount() {
    if (window.innerWidth >= 939) return 3;
    if (window.innerWidth >= 501) return 2;
    return 1;
  }

  function cardWidth() {
    const card = track.querySelector(".project-card:not(.hidden)");
    return card ? card.offsetWidth + 16 : 0;
  }

  window.updateProjectsCarouselBtns = function () {
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.offsetWidth - 4;
  };

  prevBtn.addEventListener("click", () => { track.scrollLeft -= cardWidth() * getVisibleCount(); });
  nextBtn.addEventListener("click", () => { track.scrollLeft += cardWidth() * getVisibleCount(); });
  track.addEventListener("scroll", updateProjectsCarouselBtns);
  window.addEventListener("resize", updateProjectsCarouselBtns);
  updateProjectsCarouselBtns();
});

// =======================
// Lightbox
// =======================
(function () {
  const lightbox    = document.getElementById("lightbox");
  if (!lightbox) return;

  const overlay   = lightbox.querySelector(".lightbox-overlay");
  const closeBtn  = lightbox.querySelector(".lightbox-close");
  const img       = lightbox.querySelector(".lightbox-img");
  const titleEl   = lightbox.querySelector(".lightbox-title");
  const counterEl = lightbox.querySelector(".lightbox-counter");
  const thumbsEl  = lightbox.querySelector(".lightbox-thumbs");
  const prevBtn   = lightbox.querySelector(".lightbox-prev");
  const nextBtn   = lightbox.querySelector(".lightbox-next");

  let images = [];
  let current = 0;

  function show(index) {
    current = index;
    img.src = images[current];
    img.alt = titleEl.textContent + " – Bild " + (current + 1);
    counterEl.textContent = (current + 1) + " / " + images.length;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === images.length - 1;
    thumbsEl.querySelectorAll(".lightbox-thumb").forEach((t, i) =>
      t.classList.toggle("is-active", i === current)
    );
  }

  function open(title, imgs, startIndex) {
    images = imgs;
    titleEl.textContent = title;
    thumbsEl.innerHTML = "";
    imgs.forEach((src, i) => {
      const t = document.createElement("img");
      t.src = src;
      t.className = "lightbox-thumb";
      t.alt = title + " " + (i + 1);
      t.addEventListener("click", () => show(i));
      thumbsEl.appendChild(t);
    });
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    show(startIndex || 0);
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    img.src = "";
  }

  // Karten klickbar machen
  document.querySelectorAll(".image-card[data-images]").forEach(card => {
    card.addEventListener("click", () => {
      const imgs  = JSON.parse(card.dataset.images);
      const title = card.dataset.title || "";
      open(title, imgs, 0);
    });
  });

  prevBtn.addEventListener("click", () => { if (current > 0) show(current - 1); });
  nextBtn.addEventListener("click", () => { if (current < images.length - 1) show(current + 1); });
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "ArrowLeft")  show(Math.max(0, current - 1));
    if (e.key === "ArrowRight") show(Math.min(images.length - 1, current + 1));
    if (e.key === "Escape")     close();
  });
})();