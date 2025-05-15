import { supabase } from "./database.js";

async function addUserConfig(id) {
  const { data, error } = await supabase.from("panelConfig").insert([
    {
      uuid: id,
      isCollapsed: false,
      isDark: false,
    },
  ]);
  if (error) {
    showError("Insert failed:", error.message);
  }
}

async function checkAuthAndAddConfig() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    showError("Session fetch error:", error.message);
    return;
  }

  if (session && session.user) {
    if (!(await checkIfExists(session.user.id))) {
      await addUserConfig(session.user.id);
    }
  } else {
    alert("Login First!!!");
    window.location.href = window.origin + "/web/index.html";
  }
}
async function checkIfExists(id) {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("uuid")
    .eq("uuid", id)
    .limit(1);

  if (error) {
    showError("Error querying:", error);
    return false;
  }

  return data.length > 0;
}

checkAuthAndAddConfig();
