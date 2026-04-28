const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");
const announcementText = document.querySelector("#announcementText");
const recommendationBox = document.querySelector("#recommendationBox");
const chips = document.querySelectorAll(".chip");

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const messages = [
  "Cortinas y persianas a medida en Cochabamba",
  "Medición, fabricación e instalación profesional",
  "Roller, blackout, panel japonés, lumineta y más",
  "Atención por WhatsApp y visita técnica",
];

let messageIndex = 0;

if (announcementText) {
  window.setInterval(() => {
    announcementText.classList.add("is-changing");

    window.setTimeout(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      announcementText.textContent = messages[messageIndex];
      announcementText.classList.remove("is-changing");
    }, 280);
  }, 3900);
}

const state = {
  space: "hogar",
  privacy: "media",
  light: "suave",
};

const recommendations = [
  {
    match: ({ privacy, light }) => privacy === "total" || light === "bloqueo",
    title: "PERSIANA VENECIANA a medida",
    text: "Recomendado si necesitas control de luz y privacidad media en dormitorios, oficinas o salas de estar.",
  },
  {
    match: ({ light }) => light === "regulable",
    title: "ROLLER DUO o LUMINETA",
    text: "Ideal para controlar entrada de luz durante el día con una estética moderna y premium.",
  },
  {
    match: ({ space }) => space === "negocio",
    title: "PERSIANA VERTICAL o ROLLER SIMPLE",
    text: "Solución práctica para atención comercial, consultorios y espacios que necesitan mantenimiento simple.",
  },
  {
    match: ({ space, privacy }) => space === "oficina" && privacy !== "total",
    title: "ROLLER SIMPLE screen",
    text: "Buena opción para oficinas donde importa reducir brillo, mantener orden visual y controlar privacidad.",
  },
  {
    match: () => true,
    title: "PANEL JAPONÉS o ROLLER DUO",
    text: "Buena opción para salas, ventanales y ambientes modernos con luz suave y acabado elegante.",
  },
];

const updateRecommendation = () => {
  if (!recommendationBox) return;

  const recommendation = recommendations.find((item) => item.match(state));
  recommendationBox.querySelector("strong").textContent = recommendation.title;
  recommendationBox.querySelector("p").textContent = recommendation.text;
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const group = chip.closest(".option-group");
    const groupName = group?.dataset.group;

    if (!groupName) return;

    group.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    state[groupName] = chip.dataset.value;
    updateRecommendation();
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 34, 240)}ms`;
  observer.observe(element);
});

// Modal Medidas Logic
const modalTrigger = document.querySelector("#openModalMedidas");
const modalOverlay = document.querySelector("#modalMedidas");
const modalClose = document.querySelector("#closeModalMedidas");

const openModal = () => {
  modalOverlay?.classList.add("is-active");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modalOverlay?.classList.remove("is-active");
  document.body.style.overflow = "";
};

modalTrigger?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal();
});

modalClose?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Update keyboard listener
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeModal();
    if (typeof closeGalleryModal === 'function') closeGalleryModal();
  }
});

// Image Gallery Carousel Logic
const galleryTrack = document.getElementById("galleryTrack");
const galleryImages = document.querySelectorAll(".gallery-img");

if (galleryTrack && galleryImages.length > 0) {
  let currentIndex = 0;
  // Duplicate nodes for infinite loop effect
  const cloneImages = () => {
    galleryImages.forEach(img => {
      const clone = img.cloneNode(true);
      galleryTrack.appendChild(clone);
    });
  };
  cloneImages();
  
  const allImages = document.querySelectorAll(".carousel-track .gallery-img");
  const totalItems = galleryImages.length; // Original length

  const moveToNextPair = () => {
    currentIndex += 2;
    galleryTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    
    // On mobile, show 1 by 1. On desktop, show 2 by 2.
    const isMobile = window.innerWidth <= 768;
    const movePercentage = isMobile ? currentIndex * 100 : currentIndex * 50;
    
    galleryTrack.style.transform = `translateX(-${movePercentage}%)`;

    // Reset jump when we reached the end of the original set
    if (currentIndex >= totalItems) {
      setTimeout(() => {
        galleryTrack.style.transition = 'none';
        currentIndex = 0;
        galleryTrack.style.transform = `translateX(0)`;
      }, 850); // wait for transition to finish
    }
  };

  // Run every 3 seconds
  setInterval(moveToNextPair, 3000);
}

// Gallery Lightbox Modal Logic
const modalGallery = document.querySelector("#modalGallery");
const modalGalleryImage = document.querySelector("#modalGalleryImage");
const closeGalleryBtn = document.querySelector("#closeModalGallery");
const quoteForm = document.querySelector(".quote-card");

const buildWhatsAppUrl = (message) => `https://wa.me/?text=${encodeURIComponent(message)}`;

const openGalleryModal = (src) => {
  if (modalGallery && modalGalleryImage) {
    modalGalleryImage.src = src;
    modalGallery.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }
};

const closeGalleryModal = () => {
  if (modalGallery) {
    modalGallery.classList.remove("is-active");
    document.body.style.overflow = "";
  }
};

// Add click listeners to original and cloned images
document.querySelector(".carousel-track")?.addEventListener('click', (e) => {
  if (e.target.classList.contains('gallery-img')) {
    openGalleryModal(e.target.src);
  }
});

closeGalleryBtn?.addEventListener("click", closeGalleryModal);
modalGallery?.addEventListener("click", (e) => {
  if (e.target === modalGallery) closeGalleryModal();
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

quoteForm?.querySelector("button")?.addEventListener("click", () => {
  const name = quoteForm.querySelector("input")?.value.trim();
  const product = quoteForm.querySelector("select")?.value;
  const details = quoteForm.querySelector("textarea")?.value.trim();

  const message = [
    "Hola DICOP, quiero una cotizacion.",
    name ? `Nombre: ${name}` : "",
    product ? `Producto de interes: ${product}` : "",
    details ? `Medida o ambiente: ${details}` : "",
  ].filter(Boolean).join("\n");

  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
});

// View Product Buttons Logic
document.querySelectorAll(".view-product-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const imgSrc = btn.dataset.image;
    if (imgSrc) {
      openGalleryModal(imgSrc);
    }
  });
});
