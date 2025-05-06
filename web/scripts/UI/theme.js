const themeSwitcher = document.querySelector("[data-theme-picker]");

let userTheme = "";
themeSwitcher.addEventListener("change", () => {
  console.log('clicked');
  
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
