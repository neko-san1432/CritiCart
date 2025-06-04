import { supabase } from "../scripts/api/database.js";
const tagResults = document.getElementById("tagResults");
document.getElementById("tagSearch").addEventListener("input", async (e) => {
  const searchValue = e.target.value.trim();
  if (searchValue === "") {
    tagResults.innerHTML = "";
    return;
  }
  addTagFunction(searchValue);
});
async function addTagFunction(keyword) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("tag", `%${keyword}%`);
  if (error) {
    console.log("bruh");
  }
  console.log(data);
  tagResults.innerHTML = "";
  data.forEach((tag) => {
    const idx = tag.tag.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      const beforeMatch = tag.tag.slice(0, idx);
      const match = tag.tag.slice(idx, idx + keyword.length);
      const afterMatch = tag.tag.slice(idx + keyword.length);
      const li = document.createElement("button");
      li.innerHTML = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;
      li.style.cursor = "pointer";
      li.onclick = () => {
        //redirect to the results
      };
      tagResults.appendChild(li);
    }
  });
}
