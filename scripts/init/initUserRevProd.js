import { supabase } from "../api/database.js";

let userReviewedProducts = [];
let currentPage = 0;
const reviewsPerPage = 10;

async function getUnreviewedProducts() {
  const { data: session } = await supabase.auth.getSession();
  const user = session?.session?.user;
  if (!user) return;

  const { data, error } = await supabase
    .from("productReview")
    .select(
      "reviewId,productName,productType,productRating,productDescription,userId,likes,dislikes"
    )
    .eq("userId", user.id);

  if (error) {
    console.error("Error fetching products:", error.message);
    return;
  }

  userReviewedProducts = data || [];
  await loadProductImages(userReviewedProducts);
  renderPage(); // draw the current page
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

function renderPage() {
  const container = document.getElementById("main-container");
  container.innerHTML = "";

  const start = currentPage * reviewsPerPage;
  const end = start + reviewsPerPage;
  const currentReviews = userReviewedProducts.slice(start, end);

  if (currentReviews.length === 0) {
    container.innerHTML =
      `<div style="display: flex; width: inherit; height: 70%; justify-content: center; align-items:center;">
        <span>No items as of now</span>
      </div>`;
    return;
  }
  
  currentReviews.forEach((review, index) => {
    const rating = (review.productRating.qualityRating + review.productRating.priceRating) / 2;
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.padding = "20px 40px";
    wrapper.style.margin = "0 60px";
    wrapper.style.borderRadius = "8px";
    wrapper.style.backgroundColor = "var(--base)";
    wrapper.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    wrapper.style.cursor = "pointer";

    wrapper.addEventListener("mouseenter", () => {
      tick(true, review.reviewId);
      wrapper.style.transform = "scale(1.02)";
      wrapper.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    });
    
    wrapper.addEventListener("mouseleave", () => {
      tick(false, review.reviewId);
      wrapper.style.transform = "scale(1)";
      wrapper.style.boxShadow = "none";
    });

    wrapper.innerHTML = `
      <div style="display: flex; gap: 20px; width: 100%;" id="review-${review.reviewId}">
        <div style="width: 50px; height: 50px; display: flex">
          <img src="${review.imageUrl || 'https://placehold.co/300x300?text=No+Image'}" alt="Product" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" />
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1; gap: 8px;">
          <div style="font-weight: bold">${review.productName}</div>
          <div>Rating: ${rating.toFixed(1)} ★</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">          <button id="edit-${review.reviewId}" 
            style="display: flex; padding: 8px; border-radius: 4px; background: var(--accent); border: none; cursor: pointer; opacity: 0.8; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
            onmouseover="this.style.opacity='1'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
            onmouseout="this.style.opacity='0.8'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
          >
            <svg class="invert" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="vertical-align: middle;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>          <button id="delete-${review.reviewId}" 
            style="display: flex; padding: 8px; border-radius: 4px; background: #ff4444; border: none; cursor: pointer; opacity: 0.8; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
            onmouseover="this.style.opacity='1'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
            onmouseout="this.style.opacity='0.8'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
          >
            <svg class="invert" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="vertical-align: middle;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(wrapper);

    // Add divider if not the last item
    if (index < currentReviews.length - 1) {
      const divider = document.createElement("hr");
      divider.style.margin = "0 60px";
      divider.style.border = "none";
      divider.style.borderTop = "1px solid var(--accent)";
      divider.style.opacity = "0.2";
      container.appendChild(divider);
    }

    setUtilFunc(review.reviewId);
  });
  renderPaginationControls();
}

function tick(visible, index) {
  // Visibility is now always on, we just update hover effects
  const opacity = visible ? "1" : "0.8";
  const editBtn = document.getElementById(`edit-${index}`);
  const deleteBtn = document.getElementById(`delete-${index}`);
  if (editBtn && deleteBtn) {
    editBtn.style.opacity = opacity;
    deleteBtn.style.opacity = opacity;
  }
}

function setUtilFunc(reviewId) {
  document.getElementById(`review-${reviewId}`).addEventListener("click", (e) => {
    // Only redirect if the click was directly on the review div, not on buttons
    if (e.target.closest('button')) return;
    window.location.href = `../pages/product-preview.html?reviewID=${reviewId}`;
  });
  
  document.getElementById(`edit-${reviewId}`).addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the review div click
    window.location.href = `../pages/submit-review.html?edit=true&reviewID=${reviewId}`;
  });
  
  document.getElementById(`delete-${reviewId}`).addEventListener("click", async (e) => {
    e.stopPropagation(); // Prevent triggering the review div click
    if (confirm('Are you sure you want to delete this review?')) {
      const { error } = await supabase
        .from("productReview")
        .delete()
        .eq("reviewId", reviewId);
      if (!error) {
        userReviewedProducts = userReviewedProducts.filter(review => review.reviewId !== reviewId);
        renderPage(); // refresh view after delete
      }
    }
  });
}

function renderPaginationControls() {
  const paginationContainer = document.getElementById("pagination-controls");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(userReviewedProducts.length / reviewsPerPage);
  
  // Update container styling
  paginationContainer.style.display = "flex";
  paginationContainer.style.justifyContent = "center";
  paginationContainer.style.alignItems = "center";
  paginationContainer.style.gap = "20px";
  paginationContainer.style.padding = "20px";
  const buttonStyle = `
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    background: var(--accent);
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

  paginationContainer.innerHTML = `    <button 
      onclick="prevPage()" 
      ${currentPage === 0 ? "disabled" : ""}
      style="${buttonStyle} opacity: ${currentPage === 0 ? '0.5' : '0.8'}; cursor: ${currentPage === 0 ? 'not-allowed' : 'pointer'}; transform: translateY(0);"
      onmouseover="if(!this.disabled) { this.style.opacity='1'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'; }"
      onmouseout="if(!this.disabled) { this.style.opacity='0.8'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'; }"
    >
      Previous
    </button>
    <span style="font-weight: medium">Page ${currentPage + 1} of ${totalPages}</span>
    <button 
      onclick="nextPage()" 
      ${currentPage + 1 >= totalPages ? "disabled" : ""}
      style="${buttonStyle} opacity: ${currentPage + 1 >= totalPages ? '0.5' : '0.8'}; cursor: ${currentPage + 1 >= totalPages ? 'not-allowed' : 'pointer'}; transform: translateY(0);"
      onmouseover="if(!this.disabled) { this.style.opacity='1'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'; }"
      onmouseout="if(!this.disabled) { this.style.opacity='0.8'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'; }"
    >
      Next
    </button>
  `;
}

window.prevPage = function () {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
};

window.nextPage = function () {
  const totalPages = Math.ceil(userReviewedProducts.length / reviewsPerPage);
  if (currentPage + 1 < totalPages) {
    currentPage++;
    renderPage();
  }
};

// Initialize
getUnreviewedProducts();