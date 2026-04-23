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
  "Roller, blackout, panel japonés, luminette y más",
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
    title: "Blackout a medida",
    text: "Recomendado si necesitas descanso, privacidad alta o bloqueo de luz en dormitorios, salas de reunión o consultorios.",
  },
  {
    match: ({ light }) => light === "regulable",
    title: "Roller duo o luminette",
    text: "Ideal para controlar entrada de luz durante el día con una estética moderna y premium.",
  },
  {
    match: ({ space }) => space === "negocio",
    title: "Persiana vertical o roller simple",
    text: "Solución práctica para atención comercial, consultorios y espacios que necesitan mantenimiento simple.",
  },
  {
    match: ({ space, privacy }) => space === "oficina" && privacy !== "total",
    title: "Roller simple screen",
    text: "Buena opción para oficinas donde importa reducir brillo, mantener orden visual y controlar privacidad.",
  },
  {
    match: () => true,
    title: "Panel japonés o roller duo",
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
