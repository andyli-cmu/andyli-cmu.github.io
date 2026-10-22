// Theme toggle (remembers the choice; falls back to the OS setting)
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch (e) {}

document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark =
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  root.dataset.theme = isDark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

document.getElementById("year").textContent = new Date().getFullYear();

// Photo lightbox
const photos = [...document.querySelectorAll(".gallery figure")];
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCaption = lightbox.querySelector("figcaption");
let current = 0;

function showPhoto(i) {
  current = (i + photos.length) % photos.length;
  const img = photos[current].querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = photos[current].querySelector("figcaption").textContent;
}

photos.forEach((fig, i) =>
  fig.addEventListener("click", () => {
    showPhoto(i);
    lightbox.showModal();
  })
);
lightbox.querySelector(".lb-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lb-prev").addEventListener("click", () => showPhoto(current - 1));
lightbox.querySelector(".lb-next").addEventListener("click", () => showPhoto(current + 1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.open) return;
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});

// Fade sections in as they scroll into view
const revealTargets = document.querySelectorAll(".section, .tl-item");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
revealTargets.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// Highlight the nav link for the section currently on screen
const navLinks = document.querySelectorAll(".nav nav a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));
