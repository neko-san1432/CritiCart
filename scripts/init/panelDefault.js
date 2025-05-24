import { supabase } from "../api/database.js";
console.log("✅ Supabase is connected!");
// ─────────────── UTILITY FUNCTIONS ───────────────
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
console.log("User:", user);
async function isDarkMode() {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("isDark")
    .eq("userId", user.id)
    .single();
  console.log("isDark:", data);
  if (error) {
    console.log("Error fetching isDark:", error.message);
    return false;
  }

  return data?.isDark;
}

async function isCollapsed() {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("isCollapsed")
    .eq("userId", user.id)
    .single();
  console.log("isCollapsed:", data);
  if (error) {
    console.log("Error fetching isCollapsed:", error.message);
    return false;
  }

  return data?.isCollapsed;
}

async function applyUserPreferences() {
  if (await isCollapsed()) {
    document.getElementById("menu")?.click();
  }

  const themeToggle = document.getElementById("theme");
  if (await isDarkMode()) {
    themeToggle.value = "🌑";
  } else {
    themeToggle.value = "☀️";
  }

}

applyUserPreferences();
