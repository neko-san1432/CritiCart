// ─────────────── IMPORTS ───────────────
import { supabase } from "../api/database.js";
// import { showError } from "../UI/error.js";

console.log("✅ Supabase is connected!");

// ─────────────── UTILITY FUNCTIONS ───────────────
function showError(message) {
  alert(message);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  return password.length >= 8;
}

function validateCaptcha() {
  return !!grecaptcha.getResponse();
}

// ─────────────── PANEL CONFIG ───────────────
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
    showError("Insert error: " + error.message);
  }
}

async function isAdmin(userID) {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("isAdmin")
    .eq("uuid", userID)
    .single();

  if (error) {
    showError("Admin check error: " + error.message);
    return false;
  }

  return data?.isAdmin || false;
}

// ─────────────── AUTH HANDLERS ───────────────
async function loginWithGoogle() {
  const redirectTo = `${window.location.origin}/web/pages/client/main-menu.html`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    showError("Google Login Error: " + error.message);
  }
}

async function loginWithEmail(email, password) {
  if (!isValidEmail(email)) return showError("Invalid email format.");
  if (!isStrongPassword(password)) return showError("Password must be at least 8 characters long.");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return showError("Login failed: " + error.message);

  const user = data.user;
  if (user?.email_confirmed_at) {
    window.location.href = `${window.origin}/web/pages/client/main-menu.html`;
    checkUserOnLoad();
  } else {
    showError("Please verify your email before continuing.");
  }
}

async function registerWithEmail(email, password, username) {
  if (!isValidEmail(email)) return showError("Invalid email format.");
  if (!isStrongPassword(password)) return showError("Password must be at least 8 characters long.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/web/pages/client/main-menu.html`,
      data: { username },
    },
  });

  if (error) return showError("Registration error: " + error.message);

  const user = data.user;
  if (user?.id) await insertPanelConfig(user.id);
}

async function resendVerification(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/web/pages/client/main-menu.html`,
    },
  });

  showError(
    error ? "Error resending verification email. Please try again." : "Verification email resent. Please check your inbox."
  );

  return error;
}

async function checkUserOnLoad() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) return console.log("Error fetching user: " + error.message);

  if (user) {
    console.log("User ID:", user.id);
    const isAdminUser = await isAdmin(user.id);
    const redirectTo = isAdminUser
      ? `${window.location.origin}/web/pages/admin/admin-page.html`
      : `${window.location.origin}/web/pages/client/main-menu.html`;
    window.location.href = redirectTo;
  }
}

// ─────────────── DOM EVENTS ───────────────

document.getElementById("submitRegForm").addEventListener("click", () => {
  if (!validateCaptcha()) return showError("Please complete the reCAPTCHA.");

  const remail = document.getElementById("remail").value;
  const rpass = document.getElementById("rpass").value;
  const repass = document.getElementById("rrpass").value;
  const rname = document.getElementById("rname").value;

  if (!repass || !rpass || !rname || !remail) return showError("All fields are required.");
  if (rpass !== repass) return showError("Passwords do not match.");

  registerWithEmail(remail, rpass, rname);
  document.querySelector('.boxy').style.display = "flex";
});

document.querySelectorAll(".googleLogin").forEach((button) => {
  button.addEventListener("click", loginWithGoogle);
});

document.getElementById("loginBE").addEventListener("click", () => {
  if (!validateCaptcha()) return showError("Please complete the reCAPTCHA.");

  const email = document.getElementById("lemail").value;
  const password = document.getElementById("lpass").value;

  if (!email || !password) return showError("All fields are required.");

  loginWithEmail(email, password);
});

document.getElementById("resendVerification").addEventListener("click", () => {
  const email = document.getElementById("lemail").value;
  if (!email) return showError("Email is required.");
  resendVerification(email);
});

document.getElementById("closeVerify").addEventListener("click", () => {
  document.querySelector('.boxy').style.display = "flex";
});
