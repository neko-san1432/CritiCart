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
    document.getElementById("modetheme").style.display="none";
  } else {
    leftPanel.classList.remove("collapsed");
    leftPanel.classList.add("expand");
    menu.innerHTML =
      '<svg class = "invert"width="24" height="24" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"/></svg>';
    isToggled = true;
    document.getElementById("modetheme").style.display="";
  }
});

var x = true;
const toggleTheme = document.getElementById("modetheme");
toggleTheme.addEventListener("click", () => {
  if (x) {
    document.getElementById("theme").value = "☀️";
    x = false;
    document.getElementById('img-theme').innerHTML=
    '<svg class="invert" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M13 24h-2c-.288 0-.563-.125-.753-.341l-.576-.659h4.658l-.576.659c-.19.216-.465.341-.753.341zm1.867-3c.287 0 .52.224.52.5s-.233.5-.52.5h-5.734c-.287 0-.52-.224-.52-.5s.233-.5.52-.5h5.734zm-2.871-17c2.983 0 6.004 1.97 6.004 5.734 0 1.937-.97 3.622-1.907 5.252-.907 1.574-1.843 3.201-1.844 5.014h1.001c0-3.286 3.75-6.103 3.75-10.266 0-4.34-3.502-6.734-7.004-6.734-3.498 0-6.996 2.391-6.996 6.734 0 4.163 3.75 6.98 3.75 10.266h.999c.001-1.813-.936-3.44-1.841-5.014-.938-1.63-1.908-3.315-1.908-5.252 0-3.764 3.017-5.734 5.996-5.734zm9.428 7.958c.251.114.362.411.248.662-.114.251-.41.363-.662.249l-.91-.414c-.252-.114-.363-.41-.249-.662.114-.251.411-.362.662-.248l.911.413zm-18.848 0c-.251.114-.362.411-.248.662.114.251.41.363.662.249l.91-.414c.252-.114.363-.41.249-.662-.114-.251-.411-.362-.662-.248l-.911.413zm18.924-2.958h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1c.276 0 .5.224.5.5s-.224.5-.5.5zm-18-1c.276 0 .5.224.5.5s-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1zm16.818-3.089c.227-.158.284-.469.126-.696-.157-.227-.469-.283-.696-.126l-.821.57c-.227.158-.283.469-.126.696.157.227.469.283.696.126l.821-.57zm-16.636 0c-.227-.158-.284-.469-.126-.696.157-.227.469-.283.696-.126l.821.57c.227.158.283.469.126.696-.157.227-.469.283-.696.126l-.821-.57zm13.333-3.033c.134-.241.048-.546-.193-.68-.241-.135-.546-.048-.68.192l-.488.873c-.135.241-.048.546.192.681.241.134.546.048.681-.193l.488-.873zm-10.03 0c-.134-.241-.048-.546.193-.68.241-.135.546-.048.68.192l.488.873c.135.241.048.546-.192.681-.241.134-.546.048-.681-.193l-.488-.873zm5.515-1.378c0-.276-.224-.5-.5-.5s-.5.224-.5.5v1c0 .276.224.5.5.5s.5-.224.5-.5v-1z"/></svg>';
  } else {
    x = true;
    document.getElementById("theme").value= "🌑";
    document.getElementById('img-theme').innerHTML=
    '<svg class="invert"xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 12c0 5.514-4.486 10-10 10-4.826 0-8.864-3.436-9.797-7.99 3.573.142 6.903-1.818 8.644-5.013 1.202-2.206 1.473-4.679.83-6.992 5.608-.194 10.323 4.338 10.323 9.995zm-10-12c-1.109 0-2.178.162-3.197.444 3.826 5.933-2.026 13.496-8.781 11.128l-.022.428c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12z"/></svg>';
  }
});

// const container = document.getElementById("ratingContainer");
// const fill = document.getElementById("fill");
// const statisfactionSentiment = [1, 2, 3, 4, 5];
// var x = "";
// container.addEventListener("mousemove", (e) => {
//   if (!locked) {
//     const rect = container.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
//     fill.style.width = `${percentage * 100}%`;

//     const rating = (percentage * 5).toFixed(1);
//     if (rating >= 0 && rating <= 0.9) {
//       x = "Extremely not satisfied";
//     } else if (rating >= 1 && rating <= 1.9) {
//       x = "Not satisfied";
//     } else if (rating >= 2 && rating <= 2.9) {
//       x = "Moderately satisfied";
//     } else if (rating >= 3 && rating <= 3.9) {
//       x = "Satisfied";
//     } else if (rating >= 4 && rating <= 5) {
//       x = "Extremely satisfied";
//     }
//     document.getElementById("rating").innerHTML =
//       "Rating: " + rating + "<br/>" + "Satisfaction sentiment: " + x;
//   }
// });

container.addEventListener("mouseleave", () => {
  if (!locked) {
    fill.style.width = `0%`;
  }
});
let locked = false;

container.addEventListener("click", () => {
  locked = !locked;
});
