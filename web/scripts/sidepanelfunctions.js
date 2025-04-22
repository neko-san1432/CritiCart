const review = document.getElementById("review-product");
const home = document.getElementById("home");
const appeal = document.getElementById("appeal");
const user_reviewed_products = document.getElementById("reviewed-product");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");

review.addEventListener('click',() => {
  window.location.href = "/web/pages/submit-review.html";
});
home.addEventListener('click',() => {
  window.location.href = "/web/pages/main-menu.html";
});
appeal.addEventListener('click',() => {
  window.location.href = "/web/pages/file-an-appeal.html";
});
user_reviewed_products.addEventListener('click',() => {
  window.location.href = "/web/pages/reviewed-products.html";
});
profile.addEventListener('click',() => {
  window.location.href = "/web/pages/user-profile.html";
});
logout.addEventListener('click',() => {
  window.location.href = "/web/pages/index.html";
});
