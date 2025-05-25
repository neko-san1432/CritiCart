import { supabase } from "../api/database.js";

const CATEGORIES = {
  food: { index: 0, prefix: "f" },
  cosmetics: { index: 1, prefix: "c" },
  appliances: { index: 2, prefix: "a" },
  healthWellness: { index: 3, prefix: "h" },
  toys: { index: 4, prefix: "t" },
};

const sections = Object.fromEntries(
  Object.keys(CATEGORIES).map((key) => [key, document.getElementById(key)])
);

const products = {};
const htmlContent = {};

init();

function init() {
  Object.keys(CATEGORIES).forEach(loadCategoryProducts);
}

async function loadCategoryProducts(category) {
  const section = sections[category];
  const { index, prefix } = CATEGORIES[category];

  const productData = await fetchProducts(category);
  if (!productData.length) {
    section.innerHTML = emptyMessage();
    return;
  }

  const selected = shuffle(productData).slice(0, 10);
  products[category] = selected;

  const [imageMap, profilePicMap, userNameMap] = await Promise.all([
    fetchProductImages(selected),
    getProfilePics(selected.map((p) => p.userId)),
    getUserNames(selected.map((p) => p.userId)),
  ]);

  htmlContent[category] = selected
    .map((prod, i) =>
      createProductCard(
        imageMap[prod.reviewId] || placeholderImage(),
        prod,
        averageRating(prod.productRating),
        userNameMap[prod.userId] || "Unknown",
        `${prefix}${index}-${i}`,
        category,
        profilePicMap[prod.userId] || defaultProfilePic()
      )
    )
    .join("");

  if (productData.length > 10) {
    htmlContent[category] += createSeeMoreButton(prefix);
  }

  section.innerHTML = htmlContent[category];
  attachEventListeners(category);
}

// ==========================
// Data Fetching
// ==========================

async function fetchProducts(category) {
  const { data, error } = await supabase
    .from("productReview")
    .select("reviewId,productName,productType,productRating,productDescription,userId,likes,dislikes")
    .eq("productType", category)
    .limit(10);

  if (error) {
    console.error(`Fetch error for ${category}:`, error);
    return [];
  }

  return data || [];
}

async function fetchProductImages(products) {
  const ids = products.map((p) => p.reviewId);
  const { data, error } = await supabase
    .from("productImages")
    .select("imgLink,productId")
    .in("productId", ids);

  if (error) {
    console.error("Image fetch error:", error);
    return {};
  }

  return Object.fromEntries(data.map((img) => [img.productId, img.imgLink]));
}

async function getProfilePics(userIds) {
  const picMap = {};

  await Promise.all(
    userIds.map(async (userId) => {
      const { data, error } = await supabase
        .from("userData")
        .select("avatarPath")
        .eq("udataId", userId)
        .single();

      if (error || !data?.avatarPath) return;

      const { data: urlData, error: urlError } = await supabase.storage
        .from("profilepic")
        .createSignedUrl(data.avatarPath, 86400);

      if (!urlError && urlData?.signedUrl) {
        picMap[userId] = urlData.signedUrl;
      }
    })
  );

  return picMap;
}

async function getUserNames(userIds) {
  const map = {};

  await Promise.all(
    userIds.map(async (userId) => {
      const { data, error } = await supabase
        .from("userData")
        .select("displayName")
        .eq("udataId", userId)
        .single();

      if (!error && data?.displayName) {
        map[userId] = data.displayName;
      }
    })
  );

  return map;
}

// ==========================
// Utilities
// ==========================

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function averageRating(rating) {
  return ((rating?.qualityRating || 0) + (rating?.priceRating || 0)) / 2;
}

function placeholderImage() {
  return "https://via.placeholder.com/150";
}

function defaultProfilePic() {
  return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4RZl4rXT_nAjdeMz0EhJMnulkobm_5TQU-A&s";
}

function emptyMessage() {
  return `<div style="display: flex; width: 100%; height: 200px; justify-content: center; align-items:center;"><span>No items as of now</span></div>`;
}

// ==========================
// Rendering
// ==========================

const likeSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="invert" width="24" height="24" viewBox="0 0 24 24"><path d="..."/></svg>`;

function createProductCard(thumbnail, prod, rating, displayName, id, category, profilePic) {
  return `
    <div class="product-holder" title="${prod.productName}">
      <div id="${id}" class="${category}-product" style="display: flex; flex-direction: column; align-items: center; padding: 8px; height: 100%;">
        <div style="width: 100%; height: 100px; display: flex; justify-content: center; align-items: center;">
          <img src="${thumbnail}" alt="${prod.productName}" style="max-width: 90%; max-height: 90%; object-fit: contain;" />
        </div>
        <div style="margin-top: 6px; height: 36px; font-size: 12px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${prod.productName}</div>
        <div style="margin-top: auto; font-size: 11px; display: flex; flex-direction: column; gap: 2px; padding-bottom: 6px;">
          <p>${rating.toFixed(1)}★</p>
          <p>${likeSVG} ${prod.likes}</p>
          <p>by <img src="${profilePic}" style="border-radius:50%; width:20px; height:20px; vertical-align:middle; margin: 0 4px;" />${displayName}</p>
        </div>
      </div>
    </div>
  `;
}

function createSeeMoreButton(prefix) {
  return `
    <div class="product-holder">
      <button id="${prefix}-more">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
          See more
        </div>
      </button>
    </div>`;
}

// ==========================
// Event Binding
// ==========================

function attachEventListeners(category) {
  const { index, prefix } = CATEGORIES[category];
  products[category].forEach((prod, i) => {
    const element = document.getElementById(`${prefix}${index}-${i}`);
    if (!element) return;
    element.addEventListener("click", () => {
      const url = new URL("/pages/product-preview.html", window.location.origin);
      url.searchParams.set("productID", prod.reviewId);
      window.location.href = url.toString();
    });
  });

  // const moreBtn = document.getElementById(`${prefix}-more`);
  // if (moreBtn) {
  //   moreBtn.addEventListener("click", () => {
  //     const url = new URL("/pages/category.html", window.location.origin);
  //     url.searchParams.set("category", category);
  //     window.location.href = url.toString();
  //   });
  // }
}
