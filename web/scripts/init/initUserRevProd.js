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
      "reviewId,productName,productType,qualityRating,priceRating,productDescription,userId,likes,dislikes"
    )
    .eq("uuid", user.id);

  if (error) {
    console.error("Error fetching products:", error.message);
    return;
  }

  userReviewedProducts = data || [];
  renderPage(); // draw the current page
}

function renderPage() {
  const container = document.getElementById("main-container");
  container.innerHTML = "";

  const start = currentPage * reviewsPerPage;
  const end = start + reviewsPerPage;
  const currentReviews = userReviewedProducts.slice(start, end);

  if (currentReviews.length === 0) {
    container.innerHTML =
      `<div style="display: flex; width: inherit; height: 70%; justify-content: center; align-items:center;"><span>No items as of now</span></div>`;
    return;
  }

  currentReviews.forEach((review, index) => {
    const globalIndex = start + index; // so IDs remain unique across pages
    const rating = (review.qualityRating + review.priceRating) / 2;

    const wrapper = document.createElement("div");
    wrapper.style.border = "solid";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.marginBottom = "10px";

    wrapper.addEventListener("mouseenter", () => tick(true, globalIndex));
    wrapper.addEventListener("mouseleave", () => tick(false, globalIndex));

    wrapper.innerHTML = `
      <div style="display: flex" id="review-${globalIndex}">
        <div style="height: 50px; width: 50px; display: flex">
          <img src="" alt="hi" style="border: solid; width: 50px; height: 50px" />
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center">
          <div>Name: ${review.productName}</div>
          <div>Rating: ${rating.toFixed(1)}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; align-items: center">
        <button id="edit-${globalIndex}" style="display: none; height: 50px; width: 50px">edit</button>
        <button id="delete-${globalIndex}" style="display: none; height: 50px; width: 50px">delete</button>
      </div>
    `;

    container.appendChild(wrapper);
    setUtilFunc(globalIndex);
  });

  renderPaginationControls();
}

function tick(visible, index) {
  const display = visible ? "block" : "none";
  const editBtn = document.getElementById(`edit-${index}`);
  const deleteBtn = document.getElementById(`delete-${index}`);
  if (editBtn && deleteBtn) {
    editBtn.style.display = display;
    deleteBtn.style.display = display;
  }
}

function setUtilFunc(index) {
  document.getElementById(`review-${index}`).addEventListener("click", () => {
    // redirect to product review
  });
  document.getElementById(`edit-${index}`).addEventListener("click", () => {
    // redirect to edit
  });
  document.getElementById(`delete-${index}`).addEventListener("click", async () => {
    //add confirmation
    const { error } = await supabase
      .from("productReview")
      .delete()
      .eq("reviewId", userReviewedProducts[index].reviewId);
    if (!error) {
      userReviewedProducts.splice(index, 1);
      renderPage(); // refresh view after delete
    }
  });
}

function renderPaginationControls() {
  const paginationContainer = document.getElementById("pagination-controls");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(userReviewedProducts.length / reviewsPerPage);
  paginationContainer.innerHTML = `
    <button onclick="prevPage()" ${currentPage === 0 ? "disabled" : ""}>Previous</button>
    <span> Page ${currentPage + 1} of ${totalPages} </span>
    <button onclick="nextPage()" ${currentPage + 1 >= totalPages ? "disabled" : ""}>Next</button>
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
