const themeSwitcher = document.querySelector("[data-theme-picker]");

themeSwitcher.addEventListener("change", () => {
  if (themeSwitcher.value === "☀️") {
    document.documentElement.setAttribute("data-theme", "☀️");
  }
  if (themeSwitcher.value === "🌑") {
    document.documentElement.setAttribute("data-theme", "🌑");
  }
  if (themeSwitcher.value === "💻") {
    document.documentElement.removeAttribute("data-theme");
  }
});
