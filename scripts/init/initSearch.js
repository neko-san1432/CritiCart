import { supabase } from "../api/database.js";

const params = new URLSearchParams(window.location.search);
const searchQue = params.get("tag");

document.getElementById("taging").innerHTML = `Search result for "${searchQue}"`;

const likeSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="invert" width="24" height="24" viewBox="0 0 24 24"><path d="M15.43 8.814c.808-3.283 1.252-8.814-2.197-8.814-1.861 0-2.35 1.668-2.833 3.329-1.971 6.788-5.314 7.342-8.4 7.743v9.928c3.503 0 5.584.729 8.169 1.842 1.257.541 3.053 1.158 5.336 1.158 2.538 0 4.295-.997 5.009-3.686.5-1.877 1.486-7.25 1.486-8.25 0-1.649-1.168-2.446-2.594-2.507-1.21-.051-2.87-.277-3.976-.743zm3.718 4.321l-1.394.167s-.609 1.109.141 1.115c0 0 .201.01 1.069-.027 1.082-.046 1.051 1.469.004 1.563l-1.761.099c-.734.094-.656 1.203.141 1.172 0 0 .686-.017 1.143-.041 1.068-.056 1.016 1.429.04 1.551-.424.053-1.745.115-1.745.115-.811.072-.706 1.235.109 1.141l.771-.031c.822-.074 1.003.825-.292 1.661-1.567.881-4.685.131-6.416-.614-2.238-.965-4.437-1.934-6.958-2.006v-6c3.263-.749 6.329-2.254 8.321-9.113.898-3.092 1.679-1.931 1.679.574 0 2.071-.49 3.786-.921 5.533 1.061.543 3.371 1.402 6.12 1.556 1.055.059 1.025 1.455-.051 1.585z"/></svg>`;

async function getAllRevFromSearch(keyword) {
  const { data: tagData, error: tagError } = await supabase
    .from("tags")
    .select("reviewid")
    .ilike("tag", `%${keyword}%`);

  if (tagError || !tagData) {
    console.error("Error fetching tags:", tagError);
    return [];
  }

  const reviewIds = tagData.map(item => item.reviewid);
  
  // Get product reviews for the found review IDs
  const { data: products, error: productError } = await supabase
    .from("productReview")
    .select("reviewId,productName,productType,productRating,productDescription,userId,likes,dislikes")
    .in("reviewId", reviewIds);

  if (productError || !products) {
    console.error("Error fetching products:", productError);
    return [];
  }

  // Get images for the products
  await loadProductImages(products);
  
  return products;
}

async function loadProductImages(products) {
  if (!products || products.length === 0) return;

  const reviewIds = products.map(p => p.reviewId);
  
  // Get image paths
  const { data: imageData, error: imageError } = await supabase
    .from("productImages")
    .select("imgPath,reviewId")
    .in("reviewId", reviewIds);

  if (imageError) {
    console.warn("Error fetching product images:", imageError);
    return;
  }

  // Create a map of reviewId to imgPath
  const imageMap = {};
  imageData?.forEach(img => {
    if (!imageMap[img.reviewId]) {
      imageMap[img.reviewId] = img.imgPath;
    }
  });

  // Get signed URLs for all images
  for (const product of products) {
    const imgPath = imageMap[product.reviewId];
    if (imgPath) {
      try {
        const { data } = await supabase.storage
          .from("productimages")
          .createSignedUrl(imgPath, 86400);
        
        if (data?.signedUrl) {
          product.imageUrl = data.signedUrl;
        }
      } catch (error) {
        console.warn(`Error getting signed URL for product ${product.reviewId}:`, error);
      }
    }
  }
}

async function displaySearchResults(products) {
  const resultsContainer = document.getElementById("results");
  if (!products || products.length === 0) {
    resultsContainer.innerHTML = `<div style="display: flex; width: 100%; height: 200px; justify-content: center; align-items:center;">
      <span>No results found</span>
    </div>`;
    return;
  }

  // Get profile pictures for users
  const userIds = [...new Set(products.map(p => p.userId))];
  const profilePicMap = await getProfilePics(userIds);

  // Generate HTML for all products
  let html = '<div class="search-results">';
  for (const prod of products) {
    const rating = (prod.productRating.qualityRating + prod.productRating.priceRating) / 2;
    const userData = await getUserName(prod.userId);
    const displayName = userData?.displayName || "Unknown";
    const thumb = prod.imageUrl || "https://placehold.co/300x300?text=No+Image";
    const pic = profilePicMap[prod.userId] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4RZl4rXT_nAjdeMz0EhJMnulkobm_5TQU-A&s";

    html += createProductCard(thumb, prod, rating, displayName, pic);
  }
  html += '</div>';

  resultsContainer.innerHTML = html;
  attachEventListeners(products);
}

function createProductCard(thumbnail, prod, rating, displayName, profilepic) {
  return `
    <div class="product-holder" title="${prod.productName}" data-review-id="${prod.reviewId}">
      <div class="search-product" style="
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

        <div style="
          margin-top: auto;
          width: 100%;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 2px;
          padding-bottom: 6px;
        ">
          <p style="margin: 0;">${rating.toFixed(1)}★</p>
          <p style="margin: 0;">${likeSVG} ${prod.likes}</p>
          <p style="margin: 0;">
            by
            <img src="${profilepic}" style="border-radius:50%;width:20px;height:20px; vertical-align:middle; margin-left:4px; margin-right:4px;" />
            ${displayName}
          </p>
        </div>
      </div>
    </div>
  `;
}

function attachEventListeners(products) {
  const productHolders = document.querySelectorAll('.product-holder');
  productHolders.forEach(holder => {
    holder.addEventListener('click', () => {
      const reviewId = holder.dataset.reviewId;
      const url = new URL("/pages/product-preview.html", window.location.origin);
      url.searchParams.set("reviewID", reviewId);
      window.location.href = url.toString();
    });
  });
}

async function getProfilePics(userIds) {
  const profilePicPromises = userIds.map(async (userId) => {
    const { data: profData, error: dbError } = await supabase
      .from("userData")
      .select("avatarPath")
      .eq("udataId", userId)
      .single();

    if (dbError || !profData?.avatarPath) {
      console.warn(`Failed to get avatarPath for userId=${userId}:`, dbError);
      return { userId, url: null };
    }
    if (profData.avatarPath === "N/A") {
      return { userId, url: null };
    }

    const { data, error } = await supabase.storage
      .from("profilepic")
      .createSignedUrl(profData.avatarPath, 86400);

    if (error) {
      console.warn(`Failed to get signed URL for userId=${userId}:`, error);
      return { userId, url: null };
    }

    return { userId, url: data.signedUrl };
  });

  const results = await Promise.all(profilePicPromises);
  const profilePicMap = {};
  results.forEach(({ userId, url }) => {
    profilePicMap[userId] = url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4RZl4rXT_nAjdeMz0EhJMnulkobm_5TQU-A';
  });

  return profilePicMap;
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

// Initialize search when document is loaded
document.addEventListener('DOMContentLoaded', async () => {
  if (searchQue) {
    const products = await getAllRevFromSearch(searchQue);
    await displaySearchResults(products);
  }
});