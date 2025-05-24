import { supabase } from "/scripts/api/database.js";

async function fetchAllPanelConfigs() {
  const { data, error } = await supabase
    .from("panelConfig")
    .select("*");

  if (error) {
    console.error("❌ Error fetching panelConfig:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("⚠️ No panelConfig records found.");
  } else {
    console.log("✅ All Panel Configs:");
    data.forEach((row, index) => {
      console.log(`[${index}] userId: ${row.userId}, isDark: ${row.isDark}, isCollapsed: ${row.isCollapsed}`);
    });
  }
}

fetchAllPanelConfigs();
  