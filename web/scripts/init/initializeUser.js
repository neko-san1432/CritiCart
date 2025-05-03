import { supabase } from "../api/database.js";

let sessionUserID = "";
console.log("✅ Supabase is connected!");

// ─────────────── ADMIN CHECK ───────────────
async function isAdmin() {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("isAdmin")
    .eq("uuid", sessionUserID)
    .single();

  if (error) {
    console.error("Admin check error:", error.message);
    return false;
  }

  return data?.isAdmin || false;
}

// ─────────────── GOOGLE LOGIN ───────────────
async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/web/pages/main-menu.html",
    },
  });

  if (error) {
    alert("Google Login Error: " + error.message);
    throw error;
  }
}

// ─────────────── EMAIL LOGIN ───────────────
async function loginWithEmail(mail, pass) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: mail,
    password: pass,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      alert("Incorrect email or password.");
    } else {
      alert("Login error: " + error.message);
    }
    return;
  }

  const user = data.user;
  if (user && user.email_confirmed_at) {
    window.location.href = "/web/pages/main-menu.html";
  } else {
    alert("Please verify your email before continuing.");
  }
}

// ─────────────── REGISTRATION ───────────────
async function registerWithEmail(remail, rpassword, rusername) {
  const { data, error } = await supabase.auth.signUp({
    email: remail,
    password: rpassword,
    options: {
      emailRedirectTo: window.location.origin + "/web/pages/main-menu.html",
      data: {
        username: rusername,
      },
    },
  });

  if (error) {
    alert("Registration failed: " + error.message);
    return;
  }

  const user = data.user;
  if (user?.id) {
    sessionUserID = user.id;

    const { error: insertError } = await supabase.from("panelConfig").insert([
      {
        uuid: sessionUserID,
        isCollapsed: false,
        isDark: false,
        isAdmin: false,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError.message);
    }
  }
}

// ─────────────── USER CHECK ON LOAD ───────────────
const {
  data: { user },
  error: userFetchError,
} = await supabase.auth.getUser();

if (userFetchError) {
  console.error("Error fetching user:", userFetchError.message);
} else if (user) {
  sessionUserID = user.id;
  console.log("User ID:", user.id);
}

// ─────────────── DOM EVENTS ───────────────
document.getElementById("submitRegForm").addEventListener("click", () => {
  let repass = document.getElementById("rrpass").value;
  let pass = document.getElementById("rpass").value;

  if (pass === repass) {
    registerWithEmail(
      document.getElementById("remail").value,
      document.getElementById("rpass").value,
      document.getElementById("rname").value
    );
  } else {
    alert("Passwords don't match");
  }
});

let loginGoogle = document.querySelectorAll(".googleLogin");
loginGoogle.forEach((button) => {
  button.addEventListener("click", () => {
    loginWithGoogle();
  });
});

let loginEmail = document.getElementById("loginBE");
loginEmail.addEventListener("click", () => {
  let lmail = document.getElementById("lemail").value;
  let lpass = document.getElementById("lpass").value;
  loginWithEmail(lmail, lpass);
});
