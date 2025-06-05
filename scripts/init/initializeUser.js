// ─────────────── IMPORTS ───────────────
import { supabase } from "../api/database.js";

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log("Session data:", data);
  } catch (err) {
    console.error("Supabase test failed:", err.message);
  }
}

testConnection();

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

// ─────────────── RECAPTCHA ───────────────
let reCAPTCHA_login, reCAPTCHA_register;

function initRecaptcha() {
  if (typeof grecaptcha === "undefined") {
    console.error("❌ reCAPTCHA is not loaded.");
    return;
  }

  reCAPTCHA_login = grecaptcha.render("captcha-login", {
    sitekey: "6Ld36wkrAAAAAPzVNRDG5ghTy_ZhhjyhZJY2lelr",
  });
``
  reCAPTCHA_register = grecaptcha.render("captcha-register", {
    sitekey: "6Ld36wkrAAAAAPzVNRDG5ghTy_ZhhjyhZJY2lelr",
  });
}

window.onload = () => {
  // reCAPTCHA script should already be loaded
  initRecaptcha();
};

// ─────────────── PANEL CONFIG ───────────────
async function insertPanelConfig(userID) {
  const { error } = await supabase.from("panelConfig").insert([
    {
      userId: userID,
      isCollapsed: false,
      isDark: false,
    },
  ]);
  if (error) showError("Insert error: " + error.message);
}

// ─────────────── AUTH HANDLERS ───────────────
async function loginWithGoogle() {
  const redirectTo = `${window.location.origin}/pages/main-menu.html`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) showError("Google Login Error: " + error.message);
}

async function loginWithEmail(email, password) {
  if (!isValidEmail(email)) return showError("Invalid email format.");
  if (!isStrongPassword(password)) return showError("Password too weak.");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return showError("Login failed: " + error.message);

  const user = data.user;
  if (user?.email_confirmed_at) {
    window.location.href = `${window.origin}/pages/main-menu.html`;
    checkUserOnLoad();
  } else {
    showError("Please verify your email before continuing.");
  }
}

async function registerWithEmail(mail, pass, uname) {
  if (!isValidEmail(mail)) return showError("Invalid email format.");
  if (!isStrongPassword(pass)) return showError("Password too weak.");

  const { data, error } = await supabase.auth.signUp({
    email:mail,
    password:pass,
    options: {
      emailRedirectTo: `${window.location.origin}/pages/main-menu.html`,
      data:{
        username:uname,
      }
    },
  });
  console.log(data)
  if (error) return showError("Registration error: " + error.message);
  const user = data.user;
  if (user?.id) await insertPanelConfig(user.id);
  await insertPublicMetaData(user.id,uname,mail);

}
async function insertPublicMetaData(userID,name,mail) {
  await supabase.from('userData').insert([{
    udataId: userID,
    displayName: name,
    email: mail,
    avatarPath: null // Initialize as null, will be set when user uploads an avatar
  }])
}
async function resendVerification(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/pages/main-menu.html`,
    },
  });

  showError(error ? "Error resending email." : "Verification email resent.");
  return error;
}

async function checkUserOnLoad() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return console.log("User fetch error: " + error.message);
  if (user) console.log("User ID:", user.id);
}

// ─────────────── DOM EVENTS ───────────────

document.getElementById("submitRegForm").addEventListener("click", async() => {
  const response = grecaptcha.getResponse(reCAPTCHA_register);
  if (!response) return showError("Please complete the reCAPTCHA.");

  const remail = document.getElementById("remail").value;
  const rpass = document.getElementById("rpass").value;
  const repass = document.getElementById("rrpass").value;
  const rname = document.getElementById("rname").value;

  if (!repass || !rpass || !rname || !remail)
    return showError("All fields are required.");
  if (rpass !== repass) return showError("Passwords do not match.");

  await registerWithEmail(remail, rpass, rname);
  document.querySelector(".boxy").style.display = "flex";

  // Optional: reset CAPTCHA
  grecaptcha.reset(reCAPTCHA_register);
});
document.querySelectorAll(".googleLogin").forEach((btn) => {
  btn.addEventListener("click", loginWithGoogle);
});

document.getElementById("loginBE").addEventListener("click", () => {
  const response = grecaptcha.getResponse(reCAPTCHA_login);
  if (!response) return showError("Please complete the reCAPTCHA.");

  const email = document.getElementById("lemail").value;
  const password = document.getElementById("lpass").value;

  if (!email || !password) return showError("All fields are required.");
  loginWithEmail(email, password);

  // Optional: reset CAPTCHA
  grecaptcha.reset(reCAPTCHA_login);
});

document.getElementById("resendVerification").addEventListener("click", () => {
  const email = document.getElementById("lemail").value;
  if (!email) return showError("Email is required.");
  resendVerification(email);
});

document.getElementById("closeVerify").addEventListener("click", () => {
  document.querySelector(".boxy").style.display = "flex";
});

// loginWithEmail("client@gmail.com","14321432")