// import  isDark from "./default.js";

const sliders = document.querySelectorAll(".product-holder-list");
let isDown = false;
let startX;
let scrollLeft;

sliders.forEach((slider) => {
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
});
const leftPanel = document.querySelector(".left-panel");
const menu = document.getElementById("menu");
var isToggled = true;
menu.addEventListener("click", () => {
  if (isToggled) {
    leftPanel.classList.remove("expand");
    leftPanel.classList.add("collapsed");
    menu.innerHTML =
      '<svg  class = "invert" width="24" height="24" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m13 16.745c0-.414-.336-.75-.75-.75h-9.5c-.414 0-.75.336-.75.75s.336.75.75.75h9.5c.414 0 .75-.336.75-.75zm9-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm-4-5c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg>';
    isToggled = false;
  } else {
    leftPanel.classList.remove("collapsed");
    leftPanel.classList.add("expand");
    menu.innerHTML =
      '<svg class = "invert"width="24" height="24" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"/></svg>';
    
    isToggled = true;
  }
});

var x = true;
const toggleTheme = document.getElementById("toggle-theme");
toggleTheme.addEventListener("click", () => {
  if (x) {
    toggleTheme.innerHTML =
      '<svg class = "invert" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12.434 24h-.894c-.235 0-.461-.079-.616-.218l-1.187-.782h4.5l-1.188.782c-.154.139-.38.218-.615.218zm1.845-2h-4.558c-.276 0-.5-.223-.5-.5 0-.276.224-.5.5-.5h4.558c.276 0 .5.224.5.5 0 .277-.224.5-.5.5zm-1.507-2c.152-4.705 3.229-6.902 3.229-9.255 0-2.336-1.829-3.745-3.992-3.745-1.973 0-4.009 1.232-4.009 3.754 0 2.347 3.189 5.003 3.225 9.246h-2.011c-.016-3.993-3.214-5.637-3.214-9.254 0-3.537 2.837-5.773 6.068-5.746 3.287.053 5.934 2.344 5.934 5.747 0 3.626-3.189 5.178-3.215 9.253h-2.015zm6.967-7.229l2.699 1.224-.827 1.822-2.596-1.177c.301-.6.55-1.215.724-1.869zm-15.477 0c.173.664.415 1.261.719 1.87l-2.592 1.176-.827-1.822 2.7-1.224zm18.738-1.771h-3.003c.021-.67-.04-1.345-.185-2h3.188v2zm-18.997 0h-3.003v-2h3.187c-.143.654-.203 1.326-.184 1.995v.005zm14.04-5.428l2.485-1.763 1.158 1.631-2.505 1.777c-.292-.582-.67-1.132-1.138-1.645zm-12.087-.001c-.46.503-.837 1.05-1.138 1.645l-2.503-1.776 1.157-1.631 2.484 1.762zm8.869-2.092l1.327-2.69 1.793.885-1.327 2.69c-.557-.367-1.161-.664-1.793-.885zm-5.651-.002c-.631.22-1.236.516-1.794.884l-1.326-2.687 1.794-.885 1.326 2.688zm3.826-.416c-.668-.078-1.309-.082-2-.003v-3.058h2v3.061z"/></svg>';
    x = false;
  } else {
    toggleTheme.innerHTML =
      '<svg class = "invert" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 12c0 5.514-4.486 10-10 10-4.826 0-8.864-3.436-9.797-7.99 3.573.142 6.903-1.818 8.644-5.013 1.202-2.206 1.473-4.679.83-6.992 5.608-.194 10.323 4.338 10.323 9.995zm-10-12c-1.109 0-2.178.162-3.197.444 3.826 5.933-2.026 13.496-8.781 11.128l-.022.428c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12z"/></svg>';
    x = true;
  }
});
