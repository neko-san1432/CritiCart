import { supabase } from "/web/script/api/database.js";

const params = new URLSearchParams(window.location.search);
const value = params.get("productID");

async function initSelectedProduct() {
  const { data, error } = await supabase
    .from("productReview")
    .select("*")
    .eq("reviewId", value);

  const { data1, error1 } = await supabase
    .from("comments")
    .select("*")
    .eq("reviewId", value);
  initComments(data);
}
function initComments(data) {
  const commentPane = document.getElementById("commentPane");
  let comments = "";
  for (const comment in data) {
    comments += `<>`;
  }
  commentPane.innerHTML = comments;
}
function initReview(data) {}
