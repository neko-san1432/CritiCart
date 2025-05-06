import { supabase } from "../api/database.js";
import { showError } from "../UI/error.js";

console.log("✅ Supabase is connected!");

// ─────────────── UTILITY FUNCTIONS ───────────────


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  return password.length >= 8; // Add more complexity checks if needed
}

async function insertPanelConfig(userID) {
  const { error } = await supabase.from("panelConfig").insert([
    {
      uuid: userID,
      isCollapsed: false,
      isDark: false,
      isAdmin: false,
    },
  ]);

  if (error) {
    showError("Insert error: "+ error.message);
  }
}

// ─────────────── ADMIN CHECK ───────────────
async function isAdmin(userID) {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("isAdmin")
    .eq("uuid", userID)
    .single();

  if (error) {
    showError("Admin check error: "+ error.message);
    return false;
  }

  return data?.isAdmin || false;
}

// ─────────────── GOOGLE LOGIN ───────────────
async function loginWithGoogle() {
  const redirectTo = `${window.location.origin}/web/pages/main-menu.html`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    showError("Google Login Error: "+ error.message);
  }
}

// ─────────────── EMAIL LOGIN ───────────────
async function loginWithEmail(email, password) {
  if (!isValidEmail(email)) {
    showError("Invalid email format.");
    return;
  }

  if (!isStrongPassword(password)) {
    showError("Password must be at least 8 characters long.");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showError("Login failed. Please check your credentials.");
    showError("Login error:"+ error.message);
    return;
  }

  const user = data.user;
  if (user?.email_confirmed_at) {
    window.location.href = window.origin+"/web/pages/main-menu.html";
  } else {
    showError("Please verify your email before continuing.");
  }
}

// ─────────────── REGISTRATION ───────────────
async function registerWithEmail(email, password, username) {
  if (!isValidEmail(email)) {
    showError("Invalid email format.");
    return;
  }

  if (!isStrongPassword(password)) {
    showError("Password must be at least 8 characters long.");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/web/pages/main-menu.html`,
      data: { username },
    },
  });

  if (error) {
    showError("Registration error: "+ error.message);
    return;
  }

  const user = data.user;
  if (user?.id) {
    await insertPanelConfig(user.id);
  }
}

// ─────────────── USER CHECK ON LOAD ───────────────
async function checkUserOnLoad() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    showError("Error fetching user: "+ error.message);
    return;
  }

  if (user) {
    console.log("User ID:", user.id);
    const isAdminUser = await isAdmin(user.id);
    const redirectTo = isAdminUser
      ? `${window.location.origin}/web/pages/admin/admin-page.html`
      : `${window.location.origin}/web/pages/client/main-menu.html`;

    window.location.href = redirectTo;
  }
}

checkUserOnLoad();

// ─────────────── DOM EVENTS ───────────────
document.getElementById("submitRegForm").addEventListener("click", () => {
  if(!validateCaptcha()) {
    showError("Please complete the reCAPTCHA.");
    return; // Prevent form submission if reCAPTCHA is not completed
  }
  const repass = document.getElementById("rrpass").value;
  const rpass = document.getElementById("rpass").value;
  const remail = document.getElementById("remail").value;
  const rname = document.getElementById("rname").value;

  if (!repass || !rpass || !rname || !remail) {
    showError("All fields are required.");
    return;
  }

  if (rpass !== repass) {
    showError("Passwords do not match.");
    return;
  }
  registerWithEmail(remail, rpass, rname);
  document.querySelector('.boxy').style.display = "flex"
});

document.querySelectorAll(".googleLogin").forEach((button) => {
  button.addEventListener("click", loginWithGoogle);
});

document.getElementById("loginBE").addEventListener("click", () => {
  if(!validateCaptcha()) {
    showError("Please complete the reCAPTCHA.");
    return; // Prevent form submission if reCAPTCHA is not compled
  }te
  const email = document.getElementById("lemail").value;
  const password = document.getElementById("lpass").value;

  if (!email || !password) {
    showError("All fields are required.");
    return;
  }

  loginWithEmail(email, password);
});

async function resendVerification(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: window.location.origin + "/web/pages/main-menu.html",
    },
  });
  if(error){
    showError("Error resending verification email. Please try again.");
  }else{
    showError("Verification email resent. Please check your inbox.");
  }
  return error;
}
document.getElementById("resendVerification").addEventListener("click", () => {
  const email = document.getElementById("lemail").value;
  if (!email) {
    showError("Email is required.");
    return;
  }
  resendVerification(email);
} );

function validateCaptcha() {
  const response = grecaptcha.getResponse();
  if (!response) {
    alert("Please complete the reCAPTCHA.");
    return false; // Prevent form submission
  }
  return true; // Continue with form submission
}
document.getElementById('closeVerify').addEventListener('click',()=>{
  document.querySelector('.boxy').style.display = "flex"
})