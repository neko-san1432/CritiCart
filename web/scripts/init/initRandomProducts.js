//create db
//template for prod:
/* 
<div class="product-holder">
  <button class="toys-product10">
  --insert img, product name, & rating--</button>
</div> 
*/
import { supabase } from "../api/database.js";
const foodSec = document.getElementById("food");
const cosmeticsSec = document.getElementById("cosmetics");
const appliancesSec = document.getElementById("appliances");
const hnwSec = document.getElementById("hnw");
const toySec = document.getElementById("toys");
var products = [[], [], [], [], []];
var food = "";
var cosmetics = "";
var toys = "";
var hnw = "";
var appliances = "";
function search_random_products() {
  initRandomProducts();
  if (products[0].length == 0) {
    foodSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  } else {
  }
  if (products[1].length == 0) {
    cosmeticsSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[2].length == 0) {
    appliancesSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[3].length == 0) {
    hnwSec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
  if (products[4].length == 0) {
    toySec.innerHTML =
      '<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>';
  }
}
search_random_products();
function initRandomProducts() {}

async function initFood() {
  const { data, error } = await supabase
    .from("productsReview")
    .select(
      "productName,productType,productRating,productUserDesc,userID,likes,dislikes"
    )
    .eq("productType", "food")
    .limit(10);
  if (error) {
    console.error("Error fetching products:", error);
  } else {
    const shuffled = data.sort(() => Math.random() - 0.5);
    products[0] = shuffled.slice(0, 10);
  }

  // const { data2, error2 } = supabase.from("").select;
  //update the image function here
  let rating = 0;
  for (let i = 0; i < products[0].length; i++) {
    rating =
      (products[0][i].productRating.qualityRating +
        products[0][i].productRating.priceRating) /
      2;
    food += `<div class="product-holder">
    <button class="food-product${i}"id = "f${i}">
    <img src="" alt="${products[0][i].productName}">
    <h3>${products[0][i].productName}</h3>
    <p>${rating}</p>
    <p>${products[0][i].productDescription}</p>
    <p>likes ${products[0][i].likes}
    <p>by ${getUserName(products[0][i].userID)}</p>
    </button>
    </div>`;
  }
}
async function getUserName(UUID) {
  const { data, error } = await supabase.select().eq("uuid", UUID).single();
  return data.displayName;
}
export let selectedProduct = {
  name: "",
  qualityRating: 0,
  priceRating: 0,
  productDescription: "",
  comments: [],
  personUploads: "",
};
for (let i = 0; i < 10; i++) {
  document.getElementById("f${i}").addEventListener("click", () => {
    selectedProduct.name = "";
  });
}
