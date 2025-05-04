const review = document.querySelectorAll(".review-product");
const home = document.getElementById("home");
const appeal = document.getElementById("appeal");
const user_reviewed_products = document.getElementById("reviewed-product");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");
const homel = document.getElementById("home-logo");
homel.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/client/main-menu.html";
});
review.forEach(f=>{
  f.addEventListener('click',() => {
    window.location.href = window.origin+"/web/pages/client/submit-review.html";
  });
})
home.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/client/main-menu.html";
});
appeal.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/client/file-an-appeal.html";
});
user_reviewed_products.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/client/your-reviewed-products.html";
});
profile.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/client/user-profile.html";
});
logout.addEventListener('click',() => {
  logoutfunc();
  window.location.href = window.origin+"/web/index.html";
});
import { supabase } from '../api/database.js';

async function logoutfunc() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    return;
  }
  console.log("Logged out successfully");
  localStorage.removeItem('session');
}