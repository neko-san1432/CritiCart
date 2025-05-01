//get the client UID
//get the products enlisted by the user
//redirect the user-page based on the user-type
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { DB_PUB_API, DB_PUB_URL } from "./database";
const supabaseUrl = DB_PUB_URL;
const supabaseKey = DB_PUB_API;
const supabase = createClient(supabaseUrl, supabaseKey);
let sessionUserID= ""
console.log("Supabase is connected!");
async function isAdmin() {
  const admin = await supabase
    .from("panelConfig")
    .select("isAdmin")
    .eq("user_id", sessionUserID);
}
export async function isDarkMode() {
  const admin = await supabase
    .from("panelConfig")
    .select("isDark")
    .eq("user_id", sessionUserID);
}
export async function isCollapsed() {
  const admin = await supabase
    .from("panelConfig")
    .select("isCollapsed")
    .eq("user_id", sessionUserID);
}
async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    throw error;
  } else if (isAdmin) {
    window.location.href = "/pages/admin-page.html";
  }else if (!isAdmin){
    window.location.href = "/pages/main-menu.html";
  }
}
function getRegistrationData(){
  document.getElementById('').value
  document.getElementById('').value
  document.getElementById('').value
  document.getElementById('').value
}
async function registerWithEmail(email, password, username) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (error) throw error;
  return user;
}
const {
  data: { user },
  error,
} = await supabase.auth.getUser();

if (error) {
  console.error("Error fetching user:", error.message);
} else {
  sessionUserID= user.id;
  console.log("User ID:", user.id);
}
