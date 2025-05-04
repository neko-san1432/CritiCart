const home = document.getElementById("home");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");

home.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/main-menu.html";
});

profile.addEventListener('click',() => {
  window.location.href = window.origin+"/web/pages/user-profile.html";
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