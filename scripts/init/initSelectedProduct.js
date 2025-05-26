import { supabase } from "../api/database.js";

const params = new URLSearchParams(window.location.search);
const reviewID = params.get("reviewID");

const SVG = {
  like: `<svg
            xmlns="http://www.w3.org/2000/svg"
            class="invert"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M15.43 8.814c.808-3.283 1.252-8.814-2.197-8.814-1.861 0-2.35 1.668-2.833 3.329-1.971 6.788-5.314 7.342-8.4 7.743v9.928c3.503 0 5.584.729 8.169 1.842 1.257.541 3.053 1.158 5.336 1.158 2.538 0 4.295-.997 5.009-3.686.5-1.877 1.486-7.25 1.486-8.25 0-1.649-1.168-2.446-2.594-2.507-1.21-.051-2.87-.277-3.976-.743zm3.718 4.321l-1.394.167s-.609 1.109.141 1.115c0 0 .201.01 1.069-.027 1.082-.046 1.051 1.469.004 1.563l-1.761.099c-.734.094-.656 1.203.141 1.172 0 0 .686-.017 1.143-.041 1.068-.056 1.016 1.429.04 1.551-.424.053-1.745.115-1.745.115-.811.072-.706 1.235.109 1.141l.771-.031c.822-.074 1.003.825-.292 1.661-1.567.881-4.685.131-6.416-.614-2.238-.965-4.437-1.934-6.958-2.006v-6c3.263-.749 6.329-2.254 8.321-9.113.898-3.092 1.679-1.931 1.679.574 0 2.071-.49 3.786-.921 5.533 1.061.543 3.371 1.402 6.12 1.556 1.055.059 1.025 1.455-.051 1.585z"
            />
          </svg>`,
  liked: `<svg class = "invert"xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.396 20.708c-.81-.062-.733-.812.031-.953 1.269-.234 1.827-.914 1.827-1.543 0-.529-.396-1.022-1.098-1.181-.837-.189-.664-.757.031-.812 1.132-.09 1.688-.764 1.688-1.41 0-.565-.425-1.108-1.261-1.22-.857-.115-.578-.734.031-.922.521-.16 1.354-.5 1.354-1.51 0-.672-.5-1.562-2.271-1.49-1.228.05-3.667-.198-4.979-.885.907-3.657.689-8.782-1.687-8.782-1.594 0-1.896 1.807-2.375 3.469-1.718 5.969-5.156 7.062-8.687 7.603v9.928c6.688 0 8.5 3 13.505 3 3.199 0 4.852-1.735 4.852-2.666-.001-.334-.273-.572-.961-.626z"/></svg>`,
  dislike: `<svg class="invert" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.406 14.442c1.426-.06 2.594-.858 2.594-2.506 0-1-.986-6.373-1.486-8.25-.714-2.689-2.471-3.686-5.009-3.686-2.283 0-4.079.617-5.336 1.158-2.585 1.113-4.665 1.842-8.169 1.842v9.928c3.086.401 6.43.956 8.4 7.744.483 1.66.972 3.328 2.833 3.328 3.448 0 3.005-5.531 2.196-8.814 1.107-.466 2.767-.692 3.977-.744zm-.207-1.992c-2.749.154-5.06 1.013-6.12 1.556.431 1.747.921 3.462.921 5.533 0 2.505-.781 3.666-1.679.574-1.993-6.859-5.057-8.364-8.321-9.113v-6c2.521-.072 4.72-1.041 6.959-2.005 1.731-.745 4.849-1.495 6.416-.614 1.295.836 1.114 1.734.292 1.661l-.771-.032c-.815-.094-.92 1.068-.109 1.141 0 0 1.321.062 1.745.115.976.123 1.028 1.607-.04 1.551-.457-.024-1.143-.041-1.143-.041-.797-.031-.875 1.078-.141 1.172 0 0 .714.005 1.761.099s1.078 1.609-.004 1.563c-.868-.037-1.069-.027-1.069-.027-.75.005-.874 1.028-.141 1.115l1.394.167c1.075.13 1.105 1.526.05 1.585z"/></svg>`,
  disliked: `<svg class="invert" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.396 3.292c-.811.062-.734.812.031.953 1.268.234 1.826.914 1.826 1.543 0 .529-.396 1.022-1.098 1.181-.837.189-.664.757.031.812 1.133.09 1.688.764 1.688 1.41 0 .565-.424 1.108-1.26 1.22-.857.115-.578.734.031.922.521.16 1.354.5 1.354 1.51 0 .672-.5 1.562-2.271 1.49-1.228-.05-3.666.198-4.979.885.907 3.657.689 8.782-1.687 8.782-1.594 0-1.896-1.807-2.375-3.469-1.718-5.969-5.156-7.062-8.687-7.603v-9.928c6.688 0 8.5-3 13.505-3 3.198 0 4.852 1.735 4.852 2.666-.001.334-.273.572-.961.626z"/></svg>`,
};

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
    const [
      { data: reviewData, error: reviewError },
      { data: commentData, error: commentError },
      { data: imageData, error: imageError },
    ] = await Promise.all([
      supabase
        .from("productReview")
        .select("*")
        .eq("reviewId", reviewID)
        .single(),
      supabase.from("comments").select("*").eq("reviewId", reviewID),
      supabase.from("productImages").select("*").eq("reviewId", reviewID),
    ]);
    const { data: voteData, error: selectError } = await supabase
      .from("likedProducts")
      .select("isLiked,isDisliked")
      .eq("userId", user.id)
      .eq("reviewId", reviewID)
      .single();
    if (selectError) {
      console.log("ehe");
    }
    if (reviewError || commentError || imageError)
      throw reviewError || commentError || imageError;

    initReview(reviewData, voteData);
    initComments(commentData);
    await initPictures(imageData);
  } catch (err) {
    console.error("❌ Failed to load product data:", err.message);
  }
}

function initReview(data, data1) {
  const rating =
    (data.productRating.qualityRating + data.productRating.priceRating) / 2;
  const createdAt = new Date(data.created_at);
  document.getElementById("product-title").textContent = data.productName;
  document.getElementById("productName").textContent = data.productName;
  document.getElementById(
    "qualRating"
  ).innerHTML = `Quality Rating: ${data.productRating.qualityRating} ★`;
  document.getElementById(
    "priceRating"
  ).innerHTML = `Price Rating: ${data.productRating.priceRating} ★`;
  document.getElementById("reviewDesc").innerHTML = data.productDescription;
  document.getElementById("totalRating").innerHTML = `${rating.toFixed(1)} ★`;
  document.getElementById("like").innerHTML = `${
    data1.isLiked ? SVG.liked : SVG.like
  } ${data["likes"]}`;
  document.getElementById("dislike").innerHTML = `${
    data1.isDisliked ? SVG.disliked : SVG.dislike
  } ${data["dislikes"]}`;

  document.getElementById(
    "productURL"
  ).innerHTML = `<a href="${data.productURL}">${data.productURL}</a>`;
  document.getElementById("reviewDate").innerHTML = createdAt;
  document.getElementById("cat").innerHTML = data.productType;
}

async function initComments(comments) {
  if (!Array.isArray(comments) || comments.length === 0) return;

  const userIds = comments.map((c) => c.userId);
  // Fetch user display names
  const { data: userData, error } = await supabase
    .from("userData")
    .select("udataId, displayName")
    .in("udataId", userIds);

  if (error) {
    console.error("Failed to load user data:", error);
    return;
  }

  // Create a map from userId to displayName
  const nameMap = Object.fromEntries(
    userData.map((user) => [user.udataId, user.displayName])
  );

  // Generate HTML for each comment
  const commentPane = document.getElementById("comments");

  commentPane.innerHTML = comments
    .map(async(comment, i) => {
      const name = nameMap[comment.userId] || "Anonymous";
      const{data} = await supabase.from("likedComments").select("isLiked,isDisliked").eq("userId",user.id).eq("commentId",comment.id)
      const svgLike = data.isLiked?SVG.liked:SVG.like
      const svgDislike = data.isDisliked?SVG.disliked:SVG.dislike
      return `
      <div style="width: 60%;">
        <p><strong>${name}:</strong><br>${comment.comment}</p>
        <button id="likeComment${i}" style="width:50px;height:50px">
          ${svgLike} ${comment.likes}
        </button>
        <button id="dislikeComment${i}" style="width:50px;height:50px">
          ${svgDislike} ${comment.dislikes}
        </button>
        <hr style="width: 100%;" />
      </div>
      <br>
    `;
    })
    .join("");

  // Add event listeners after DOM content is updated
  comments.forEach((comment, i) => {
    const likeBtn = document.getElementById(`likeComment${i}`);
    const dislikeBtn = document.getElementById(`dislikeComment${i}`);
    likeBtn.addEventListener("click",async () => {
      await handleVoteComment("like",i,comment.commentId)
    });

    dislikeBtn.addEventListener("click", async() => {
      await handleVoteComment("like",i,comment.commentId)
    });
  });
}
async function handleVoteComment(type,idx,idComm) {
  const isLike = type === "like";
  const field = isLike ? "isLiked" : "isDisliked";
  const oppField = isLike ? "isDisliked" : "isLiked";
  const counter = isLike ? "likes" : "dislikes";
  const oppCounter = isLike ? "dislikes" : "likes"
  const buttonname = isLike ? `likeComment${idx}`:`dislikeComment${idx}`;
  const oppositeConfirm = isLike?`dislikeComment${idx}`:`likeComment${idx}`;
  const svg = isLike
    ? { default: SVG.like, toggled: SVG.liked }
    : { default: SVG.dislike, toggled: SVG.disliked };
  const button = document.getElementById(buttonname);
  const oppositeB = document.getElementById(oppositeConfirm);
  const { data: voteData, error: selectError } = await supabase
    .from("likedComments")
    .select(field)
    .eq("userId", user.id)
    .eq("commentId", idComm)
    .single();
    const { data: voteDataOpp, error: selectErrorOpp } = await supabase
    .from("likedComments")
    .select(!field)
    .eq("userId", user.id)
    .eq("commentId", idComm)
    .single();

  if (selectError || !voteData) {
    const { error: insertError } = await supabase
      .from("likedComments")
      .insert([{ userId: user.id, commentId: idComm, [field]: true }]);
    if (insertError) {
      console.error("Error inserting data:", insertError);
    }
    return;
  }

  const toggled = !voteData[field];
  const { error: updateError } = await supabase
    .from("likedComments")
    .update({ [field]: toggled })
    .eq("userId", user.id)
    .eq("commentId", idComm);

  const { data: countData, error: countError } = await supabase
    .from("comments")
    .select(counter)
    .eq("commentId", idComm)
    .single();

  const newCount = toggled ? countData[counter] + 1 : countData[counter] - 1;
  const { error: countUpdateError } = await supabase
    .from("comments")
    .update({ [counter]: newCount })
    .eq("commentId", idComm);

  if (updateError || countError || countUpdateError) {
    console.error(
      "Error updating values:",
      updateError || countError || countUpdateError
    );
    return;
  }

  button.innerHTML = `${toggled ? svg.toggled : svg.default} ${newCount}`;
}
async function initPictures(data) {
  if (!data) return;
  const gallery = document.getElementById("gallery");
  const thumbnailPane = document.querySelector(".thumbnails");
  gallery.innerHTML = "";
  thumbnailPane.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const filePath = data[i].imgLink;
    const { data: signed, error } = await supabase.storage
      .from("product-images")
      .createSignedUrl(filePath, 86400);

    const imageUrl = signed?.signedUrl || "fallback.png";
    if (error) console.warn("⚠️ Signed URL error:", error);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `Image ${i}`;
    img.classList.toggle("active", i === 0);
    gallery.appendChild(img);

    const thumb = document.createElement("img");
    thumb.src = imageUrl;
    thumb.alt = `Thumbnail ${i}`;
    thumb.classList.add("thumb");
    thumb.classList.toggle("active-thumb", i === 0);
    thumb.addEventListener("click", () => goToImage(i));
    thumbnailPane.appendChild(thumb);
  }

  images = Array.from(gallery.querySelectorAll("img"));
  thumbnails = Array.from(thumbnailPane.querySelectorAll("img"));
}

function showImage(index) {
  images.forEach((img, i) => img.classList.toggle("active", i === index));
  thumbnails.forEach((thumb, i) =>
    thumb.classList.toggle("active-thumb", i === index)
  );
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

const {
  data: { user },
} = await supabase.auth.getUser();

document.getElementById("like").addEventListener("click", async () => {
  await handleVote("like");
});

document.getElementById("dislike").addEventListener("click", async () => {
  await handleVote("dislike");
});

async function handleVote(type) {
  const isLike = type === "like";
  const field = isLike ? "isLiked" : "isDisliked";
  const counter = isLike ? "likes" : "dislikes";
  const svg = isLike
    ? { default: SVG.like, toggled: SVG.liked }
    : { default: SVG.dislike, toggled: SVG.disliked };
  const button = document.getElementById(type);

  const { data: voteData, error: selectError } = await supabase
    .from("likedProducts")
    .select(field)
    .eq("userId", user.id)
    .eq("reviewId", reviewID)
    .single();

  if (selectError || !voteData) {
    const { error: insertError } = await supabase
      .from("likedProducts")
      .insert([{ userId: user.id, reviewId: reviewID, [field]: true }]);
    if (insertError) {
      console.error("Error inserting data:", insertError);
    }
    return;
  }

  const toggled = !voteData[field];
  const { error: updateError } = await supabase
    .from("likedProducts")
    .update({ [field]: toggled })
    .eq("userId", user.id)
    .eq("reviewId", reviewID);

  const { data: countData, error: countError } = await supabase
    .from("productReview")
    .select(counter)
    .eq("reviewId", reviewID)
    .single();

  const newCount = toggled ? countData[counter] + 1 : countData[counter] - 1;
  const { error: countUpdateError } = await supabase
    .from("productReview")
    .update({ [counter]: newCount })
    .eq("reviewId", reviewID);

  if (updateError || countError || countUpdateError) {
    console.error(
      "Error updating values:",
      updateError || countError || countUpdateError
    );
    return;
  }

  button.innerHTML = `${toggled ? svg.toggled : svg.default} ${newCount}`;
}

document.getElementById("newComment").addEventListener("click", async () => {
  let innerComment = document.getElementById("sendComment").value;
  if (!innerComment === "") {
    const { error: submissionError } = await supabase.from("comments").insert([
      {
        reviewID: reviewID,
        userId: user.id,
        comment: innerComment,
      },
    ]);
    location.reload();
    if (submissionError) {
      console.error("Error inserting comment", submissionError);
    }
  } else {
    console.error("Empty field");
  }
});
