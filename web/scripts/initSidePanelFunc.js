const review = document.querySelectorAll(".review-product");
const home = document.getElementById("home");
const appeal = document.getElementById("appeal");
const user_reviewed_products = document.getElementById("reviewed-product");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");
import isCollapsed from './scripts/api/initializeUser.js'
if(isCollapsed){
  
}
review.forEach(f=>{
  f.addEventListener('click',() => {
    window.location.href = "/web/pages/submit-review.html";
  });
})
home.addEventListener('click',() => {
  window.location.href = "/web/pages/main-menu.html";
});
appeal.addEventListener('click',() => {
  window.location.href = "/web/pages/file-an-appeal.html";
});
user_reviewed_products.addEventListener('click',() => {
  window.location.href = "/web/pages/your-reviewed-products.html";
});
profile.addEventListener('click',() => {
  window.location.href = "/web/pages/user-profile.html";
});
logout.addEventListener('click',() => {
  logout();
  window.location.href = "/web/index.html";
});
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { DB_PUB_API, DB_PUB_URL } from "./database";
const supabaseUrl = DB_PUB_URL;
const supabaseKey = DB_PUB_API;
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase is connected!");

async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    return;
  }

  console.log("Logged out successfully");
  localStorage.removeItem('session');
}