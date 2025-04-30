let unreviewed_products = [];
let x = "";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { DB_PUB_API, DB_PUB_URL } from "./database";
const supabaseUrl = DB_PUB_URL;
const supabaseKey = DB_PUB_API;
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase is connected!");
function getUnreviewedProducts() {
  let tmp = "";
  //logic here
  if (unreviewed_products.length == 0) {
    x =
      '<div style="display: flex;width: inherit;height: 70%;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  } else {
    x = tmp;
  }
  show();
}
function show() {
  document.getElementById("main-container").innerHTML = x;
}
console.log(unreviewed_products.length);
