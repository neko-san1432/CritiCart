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

searchRandomProducts();

function searchRandomProducts() {
  Object.keys(sections).forEach(initCategory);
}

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

  if (error || !data || data.length === 0) {
    console.error(`Error fetching ${category} products:`, error);
    section.innerHTML = emptyMessage();
    return;
  }

  const shuffled = data.sort(() => Math.random() - 0.5);
  const selectedProducts = shuffled.slice(0, 10);
  products[category] = selectedProducts;

  const reviewIds = selectedProducts.map((p) => p.reviewId);
  const { data: imageData, error: imageError } = await supabase
    .from("productImages")
    .select("imgLink,productId")
    .in("productId", reviewIds);

  if (imageError) {
    console.error(`Error fetching ${category} images:`, imageError);
  }

  const imageMap = {};
  imageData?.forEach((img) => {
    if (!imageMap[img.productId]) {
      imageMap[img.productId] = img.imgLink;
    }
  });

  for (let i = 0; i < selectedProducts.length; i++) {
    const prod = selectedProducts[i];
    const rating =
      (prod.productRating.qualityRating + prod.productRating.priceRating) / 2;
    const userData = await getUserName(prod.userId);
    const displayName = userData?.displayName || "Unknown";
    const id = `${prefix}${index}-${i}`;
    const thumb = imageMap[prod.reviewId] || "https://via.placeholder.com/150";

    htmlContent[category] += createProductCard(
      thumb,
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

const likeSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="invert" width="24" height="24" viewBox="0 0 24 24"><path d="M15.43 8.814c.808-3.283 1.252-8.814-2.197-8.814-1.861 0-2.35 1.668-2.833 3.329-1.971 6.788-5.314 7.342-8.4 7.743v9.928c3.503 0 5.584.729 8.169 1.842 1.257.541 3.053 1.158 5.336 1.158 2.538 0 4.295-.997 5.009-3.686.5-1.877 1.486-7.25 1.486-8.25 0-1.649-1.168-2.446-2.594-2.507-1.21-.051-2.87-.277-3.976-.743zm3.718 4.321l-1.394.167s-.609 1.109.141 1.115c0 0 .201.01 1.069-.027 1.082-.046 1.051 1.469.004 1.563l-1.761.099c-.734.094-.656 1.203.141 1.172 0 0 .686-.017 1.143-.041 1.068-.056 1.016 1.429.04 1.551-.424.053-1.745.115-1.745.115-.811.072-.706 1.235.109 1.141l.771-.031c.822-.074 1.003.825-.292 1.661-1.567.881-4.685.131-6.416-.614-2.238-.965-4.437-1.934-6.958-2.006v-6c3.263-.749 6.329-2.254 8.321-9.113.898-3.092 1.679-1.931 1.679.574 0 2.071-.49 3.786-.921 5.533 1.061.543 3.371 1.402 6.12 1.556 1.055.059 1.025 1.455-.051 1.585z"/></svg>`;

function createProductCard(thumbnail, prod, rating, displayName, id, category) {
  return `
    <div class="product-holder" title="${prod.productName}" >
      <div id="${id}" class="${category}-product" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        height: 100%;
      ">
        <div style="
          width: 100%;
          height: 100px;
          background-color: white;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
          <img src="${thumbnail}" alt="${prod.productName}" style="
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            background-color: white;
          ">
        </div>
        
        <div style="
          margin-top: 6px;
          height: 36px;
          width: 100%;
          text-align: center;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        ">
          ${prod.productName}
        </div>

        <!-- Bottom Info Fixed Position -->
        <div style="
          margin-top: auto;
          width: 100%;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 2px;
          padding-bottom: 6px;
        ">
          <p style="margin: 0;">${rating.toFixed(1)}★</p>
          <p style="margin: 0;">${likeSVG} ${prod.likes}</p>
          <p style="margin: 0;">by ${displayName}</p>
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

function attachEventListeners(category) {
  const { index, prefix } = categoryMeta[category];
  products[category].forEach((prod, i) => {
    const element = document.getElementById(`${prefix}${index}-${i}`);
    if (!element) return;
    element.addEventListener("click", () => {
      const url = new URL("/pages/product-preview.html", window.location.origin);
      url.searchParams.set("productID", prod.reviewId);
      window.location.href = url.toString();
    });
  });

  const moreBtn = document.getElementById(`${prefix}-more`);
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      const url = new URL("/pages/category.html", window.location.origin);
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
