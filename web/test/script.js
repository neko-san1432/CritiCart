import { supabase } from "../scripts/api/database.js";

// DOM elements
const output = document.getElementById("output");
const readButton = document.getElementById("read-btn");

let currentUser = null;

// ──────── LOGIN ────────
async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    output.textContent = `❌ Login failed: ${error.message}`;
    console.error(error);
    return;
  }

  currentUser = data.user;
  output.textContent = `✅ Logged in as: ${currentUser.email}`;
  console.log("User:", currentUser);
}

// ──────── READ PANEL CONFIG ────────
async function getPanelConfig(userID) {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("*")
    .eq("user_id", userID)
    .single();

  if (error) {
    console.log(data)
    console.error("Select error:", error.message);
    output.textContent = `Error: ${error.message}`;
    return null;
  }

  return data;
}

// ──────── EVENT: Read Button ────────
readButton.addEventListener("click", async () => {
  if (!currentUser) {
    output.textContent = "❌ User not authenticated.";
    return;
  }

  const panelConfig = await getPanelConfig(currentUser.id);
  if (panelConfig) {
    output.textContent = `✅ Panel Config:\n${JSON.stringify(panelConfig, null, 2)}`;
  }
});

// ──────── INIT: Auto-login (for demo) ────────
loginUser("admin@gmail.com", "14321432");
