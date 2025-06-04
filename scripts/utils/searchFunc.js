import { supabase } from "../api/database.js";
const searchBar = document.getElementById("searchInput");
const tagResults = document.getElementById("tagResults");
document.addEventListener("DOMContentLoaded", () => {
  searchBar.addEventListener("input", (e) => {
    
    const searchValue = e.target.value.trim();
    if (searchValue === "") {
      tagResults.innerHTML = "";
      tagResults.style.display = "none";
      return;
    } else {
      tagResults.style.display = "flex";
    }
    addTagFunction(searchValue);
  });
});
async function addTagFunction(keyword) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("tag", `%${keyword}%`);
  if (error) {
    console.log("bruh");
  }
  tagResults.innerHTML = "";
  if(data.length===0){
    tagResults.style.display='none'
    return;
  }
  data.forEach((tag) => {
    const idx = tag.tag.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      const beforeMatch = tag.tag.slice(0, idx);
      const match = tag.tag.slice(idx, idx + keyword.length);
      const afterMatch = tag.tag.slice(idx + keyword.length);
      const li = document.createElement("button");
      li.innerHTML = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;
      li.style.cursor = "pointer";
      li.style.width = "100%";
      li.style.height = "40px";
      li.onclick = () => {
        const url = new URL("/pages/search.html", window.location.origin);
        url.searchParams.set("tag", tag.tag);
        window.location.href = url.toString();
      };
      tagResults.appendChild(li);
    }
  });
}
searchBar.addEventListener('keydown',async (e)=> {
    if(e.key ==="Enter"){
        const url = new URL("/pages/search.html", window.location.origin);
        url.searchParams.set("tag",  e.target.value.trim());
        window.location.href = url.toString();
    }
})