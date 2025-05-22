//create db
//template for prod:
/* 
<div class="product-holder">
  <button class="toys-product10">
  --insert img, product name, & rating--</button>
</div> 
*/
import { supabase } from "../api/database.js";

const sections = {
  food: document.getElementById("food"),
  cosmetics: document.getElementById("cosmetics"),
  appliances: document.getElementById("appliances"),
  hnw: document.getElementById("hnw"),
  toys: document.getElementById("toys"),
};

const categoryIndexMap = {
  food: 0,
  cosmetics: 1,
  appliances: 2,
  hnw: 3,
  toys: 4,
};

let products = [[], [], [], [], []];

let htmlContent = {
  food: "",
  cosmetics: "",
  appliances: "",
  hnw: "",
  toys: "",
};

function search_random_products() {
  for (const category in sections) {
    initCategory(category);
  }
}

search_random_products();

async function initCategory(category) {
  const { data, error } = await supabase
    .from("productReview")
    .select("productName,productType,productRating,productDescription,userId,likes,dislikes")
    .eq("productType", category)
    .limit(10);
  const section = sections[category];
  const index = categoryIndexMap[category];
  if (error) {
    console.error(`Error fetching ${category} products:`, error);
    section.innerHTML = `<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>`;
    return;
  }

  const shuffled = data.sort(() => Math.random() - 0.5);
  products[index] = shuffled.slice(0, 10);

  if (products[index].length === 0) {
    section.innerHTML = `<div style="display: flex;width: 100%;height: 200px;justify-content: center;align-items:center;"><span>No items as of now</span></div>`;
    return;
  }

  for (let i = 0; i < products[index].length; i++) {
    const prod = products[index][i];
    const rating = (prod.productRating.qualityRating + prod.productRating.priceRating) / 2;
    const userData = await getUserName(prod.userId);
    const displayName = userData?.displayName || "Unknown";

    htmlContent[category] += `
      <div class="product-holder">
        <button class="${category}-product${i}" id="f${index}-${i}">
          <img src="" alt="${prod.productName}">
          <h3>${prod.productName}</h3>
          <p>${rating.toFixed(1)}</p>
          <p>${prod.productDescription}</p>
          <p>likes ${prod.likes}</p>
          <p>by ${displayName}</p>
        </button>
      </div>`;
  }
  section.innerHTML = htmlContent[category];
}
async function getUserName(UUID) {
  const { data, error } = await supabase
    .from("userData")
    .select("displayName")
    .eq("udataId", UUID)
    .single();
  if (error) console.warn("User fetch error:", error);
  return data;
}

export let selectedProduct = {
  name: "",
  qualityRating: 0,
  priceRating: 0,
  productDescription: "",
  comments: [],
  personUploads: "",
};