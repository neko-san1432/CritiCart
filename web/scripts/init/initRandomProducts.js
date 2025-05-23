import { supabase } from "../api/database.js";

const sections = {
  food: document.getElementById("food"),
  cosmetics: document.getElementById("cosmetics"),
  appliances: document.getElementById("appliances"),
  hnw: document.getElementById("hnw"),
  toys: document.getElementById("toys"),
};

const categoryMeta = {
  food: { index: 0, prefix: "f" },
  cosmetics: { index: 1, prefix: "c" },
  appliances: { index: 2, prefix: "a" },
  hnw: { index: 3, prefix: "h" },
  toys: { index: 4, prefix: "t" },
};

const products = {
  food: [],
  cosmetics: [],
  appliances: [],
  hnw: [],
  toys: [],
};

const htmlContent = {
  food: "",
  cosmetics: "",
  appliances: "",
  hnw: "",
  toys: "",
};

function searchRandomProducts() {
  Object.keys(sections).forEach(initCategory);
}

searchRandomProducts();

async function initCategory(category) {
  const section = sections[category];
  const { index, prefix } = categoryMeta[category];

  const { data, error } = await supabase
    .from("productReview")
    .select(
      "reviewId,productName,productType,productRating,productDescription,userId,likes,dislikes"
    )
    .eq("productType", category)
    .limit(10);

  if (error || !data) {
    console.error(`Error fetching ${category} products:`, error);
    section.innerHTML = emptyMessage();
    return;
  }

  const shuffled = data.sort(() => Math.random() - 0.5);
  products[category] = shuffled.slice(0, 10);

  if (products[category].length === 0) {
    section.innerHTML = emptyMessage();
    return;
  }

  for (let i = 0; i < products[category].length; i++) {
    const prod = products[category][i];
    const rating =
      (prod.productRating.qualityRating + prod.productRating.priceRating) / 2;
    const userData = await getUserName(prod.userId);
    const displayName = userData?.displayName || "Unknown";
    const id = `${prefix}${index}-${i}`;

    htmlContent[category] += createProductCard(
      prod,
      rating,
      displayName,
      id,
      category
    );
  }

  if (shuffled.length > 10) {
    htmlContent[category] += createSeeMoreButton(prefix);
  }

  section.innerHTML = htmlContent[category];
  attachEventListeners(category);
}

function emptyMessage() {
  return `<div style="display: flex; width: 100%; height: 200px; justify-content: center; align-items:center;"><span>No items as of now</span></div>`;
}

function createProductCard(prod, rating, displayName, id, category) {
  return `
    <div class="product-holder">
      <div class="${category}-product" id="${id}">
        <img src="" alt="${prod.productName}">
        <h3>${prod.productName}</h3>
        <p>${rating.toFixed(1)}</p>
        <p>${prod.productDescription}</p>
        <p>likes ${prod.likes}</p>
        <p>by ${displayName}</p>
      </div>
    </div>`;
}

function createSeeMoreButton(prefix) {
  return `
    <div class="product-holder">
      <button id="${prefix}-more">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
          <!-- SVG Placeholder -->
          See more
        </div>
      </button>
    </div>`;
}

function attachEventListeners(category) {
  const { index, prefix } = categoryMeta[category];
  products[category].forEach((prod, i) => {
    const element = document.getElementById(`${prefix}${index}-${i}`);
    if (!element) return;
    element.addEventListener("click", () => {
      const url = new URL(
        "/web/pages/product-preview.html",
        window.location.origin
      );
      url.searchParams.set("productID", prod.reviewId);
      window.location.href = url.toString();
    });
  });

  const moreBtn = document.getElementById(`${prefix}-more`);
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      const url = new URL("/web/pages/category.html", window.location.origin);
      url.searchParams.set("category", category);
      window.location.href = url.toString();
    });
  }
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
