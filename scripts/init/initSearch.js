import { supabase } from "../api/database";
// params here
const searchQue = "";

async function getAllRevFromSearch(keyword) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("tag", keyword);
}
