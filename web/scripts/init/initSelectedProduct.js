import { supabase } from "/web/script/api/database.js";

const params = new URLSearchParams(window.location.search);
const productID = params.get("productID");

const dislikeSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="invert" width="24" height="24" viewBox="0 0 24 24"><path d="..."/></svg>`;
const likeSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="invert" width="24" height="24" viewBox="0 0 24 24"><path d="..."/></svg>`;

let images = [];
let thumbnails = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  initSelectedProduct();
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
});

async function initSelectedProduct() {
  try {
    const { data: reviewData, error: reviewError } = await supabase
      .from("productReview")
      .select("*")
      .eq("reviewId", productID)
      .single();
    if (reviewError) throw reviewError;
    initReview(reviewData);

    const { data: commentData, error: commentError } = await supabase
      .from("comments")
      .select("*")
      .eq("reviewId", productID);
    if (commentError) throw commentError;
    initComments(commentData);

    const { data: imageData, error: imageError } = await supabase
      .from("productImages")
      .select("*")
      .eq("reviewId", productID);
    if (imageError) throw imageError;
    initPictures(imageData);

  } catch (err) {
    console.error("Failed to load product data:", err.message);
  }
}

function initReview(data) {
  const rating =
    (data.productRating.qualityRating + data.productRating.priceRating) / 2;

  document.getElementById("productName").textContent = data.productName;
  document.getElementById("qualRating").innerHTML = `Quality Rating: ${data.productRating.qualityRating}★`;
  document.getElementById("priceRating").innerHTML = `Price Rating: ${data.productRating.priceRating}★`;
  document.getElementById("reviewDesc").innerHTML = data.productDescription;
  document.getElementById("totalRating").innerHTML = `${rating.toFixed(1)}★`;

  document.getElementById("like").innerHTML = `${data.likes} ${likeSVG}`;
  document.getElementById("dislike").innerHTML = `${data.dislikes} ${dislikeSVG}`;
}

function initComments(comments) {
  const commentPane = document.getElementById("commentPane");
  commentPane.innerHTML = comments.map(comment => `
    <div class="comment">
      <p><strong>${comment.username || "Anonymous"}:</strong> ${comment.text}</p>
    </div>
  `).join("");
}

function initPictures(data) {
  const gallery = document.getElementById("gallery");
  const thumbnailPane = document.querySelector(".thumbnail");

  gallery.innerHTML = "";
  thumbnailPane.innerHTML = "";

  data.forEach((imgData, i) => {
    const img = document.createElement("img");
    img.src = imgData.imgLink;
    img.alt = `Image ${i}`;
    img.classList.add(i === 0 ? "active" : "");
    gallery.appendChild(img);

    const thumb = document.createElement("img");
    thumb.src = imgData.imgLink;
    thumb.alt = `Thumbnail ${i}`;
    thumb.classList.add("thumb", i === 0 ? "active-thumb" : "");
    thumb.addEventListener("click", () => goToImage(i));
    thumbnailPane.appendChild(thumb);
  });

  images = Array.from(gallery.querySelectorAll("img"));
  thumbnails = Array.from(thumbnailPane.querySelectorAll("img"));
}

function showImage(index) {
  images.forEach((img, i) => img.classList.toggle("active", i === index));
  thumbnails.forEach((thumb, i) => thumb.classList.toggle("active-thumb", i === index));
  currentIndex = index;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

function goToImage(index) {
  showImage(index);
}
