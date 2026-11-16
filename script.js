const menuButton = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#navlinks");
const contactForm = document.querySelector("#contact-form");
const themeButton = document.querySelector("#theme-toggle");
const pageSections = Array.from(document.querySelectorAll("main > section[id]"));
const sectionLinks = document.querySelectorAll('.header a[href^="#"]');

const savedTheme = window.localStorage.getItem("portfolio-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.dataset.theme = savedTheme;
}

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeButton.setAttribute("aria-pressed", String(isDark));
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    isDark ? "#101821" : "#f5f7f5",
  );
}

updateThemeButton();
themeButton?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  window.localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeButton();
});

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuButton.textContent = isOpen ? "×" : "☰";
});

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a") : null;
  if (!link) return;

  if (navigation?.contains(link) && navigation.classList.contains("open")) {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    if (menuButton) menuButton.textContent = "☰";
  }

  const targetId = link.getAttribute("href");
  if (!targetId?.startsWith("#")) return;

  const sectionId = targetId.slice(1);
  const target = pageSections.find((section) => section.id === sectionId);
  if (!target) return;

  event.preventDefault();
  showSection(sectionId, { updateHistory: true });
});

function showSection(sectionId, { updateHistory = false, scroll = true } = {}) {
  const activeSection = pageSections.find((section) => section.id === sectionId);
  if (!activeSection) return false;

  document.body.classList.add("section-mode");
  pageSections.forEach((section) => {
    section.hidden = section !== activeSection;
  });
  sectionLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const hash = `#${sectionId}`;
  if (updateHistory && window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }

  const behavior =
    scroll && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";
  activeSection.scrollTo({ top: 0, behavior });
  window.scrollTo({ top: 0, behavior });

  return true;
}

function showSectionFromLocation() {
  const sectionId = window.location.hash.slice(1) || "home";
  if (!showSection(sectionId, { scroll: Boolean(window.location.hash) })) {
    showSection("home", { scroll: false });
  }
}

window.addEventListener("popstate", showSectionFromLocation);
showSectionFromLocation();

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(formData.get("subject"));
  const message = encodeURIComponent(
    `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`,
  );

  window.location.href = `mailto:gaurangushir18@gmail.com?subject=${subject}&body=${message}`;
});
