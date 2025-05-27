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
    let voteData = {
      isDisliked: false,
      isLiked: false,
    };

    const { data: voteResult, error: selectError } = await supabase
      .from("likedProducts")
      .select("isLiked,isDisliked")
      .eq("userId", user.id)
      .eq("reviewId", reviewID)
      .single();

    if (!selectError && voteResult) {
      voteData = voteResult;
    }
    console.log(reviewData);
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
  console.log(data.productURL);
  document.getElementById("reviewDate").innerHTML = createdAt;
  document.getElementById("cat").innerHTML = data.productType;
}

async function initComments(comments) {
  if (!Array.isArray(comments)) return;

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

  const commentPane = document.getElementById("comments");

  if (comments.length === 0) {
    commentPane.innerHTML =
      '<div class="no-comments">No comments yet. Be the first to comment!</div>';
    return;
  }

  // Generate HTML for each comment (await all promises before joining)
  const commentHtmlArr = await Promise.all(
    comments.map(async (comment, i) => {
      const name = nameMap[comment.userId] || "Anonymous";
      let data = { isLiked: false, isDisliked: false };

      if (comment.commentId) {
        const res = await supabase
          .from("likedComments")
          .select("isLiked,isDisliked")
          .eq("userId", user.id)
          .eq("commentId", comment.commentId)
          .single();
        if (res && res.data) data = res.data;
      }

      const svgLike = data.isLiked ? SVG.liked : SVG.like;
      const svgDislike = data.isDisliked ? SVG.disliked : SVG.dislike;

      const date = new Date(comment.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return `
        <div class="comment-item">
          <div class="comment-header">
            <strong>${name}</strong>
            <span class="comment-date">${formattedDate}</span>
          </div>
          <div class="comment-content">${comment.comment}</div>
          <div class="comment-actions">
            <button id="likeComment${i}" class="vote-button">
              ${svgLike} ${comment.likes || 0}
            </button>
            <button id="dislikeComment${i}" class="vote-button">
              ${svgDislike} ${comment.dislikes || 0}
            </button>
          </div>
          <hr class="comment-divider" />
        </div>
      `;
    })
  );

  commentPane.innerHTML = commentHtmlArr.join("");

  // Add event listeners after DOM content is updated
  comments.forEach((comment, i) => {
    const likeBtn = document.getElementById(`likeComment${i}`);
    const dislikeBtn = document.getElementById(`dislikeComment${i}`);

    if (likeBtn) {
      likeBtn.addEventListener("click", async () => {
        if (comment.commentId) {
          likeBtn.disabled = true;
          await handleVoteComment("like", i, comment.commentId);
          likeBtn.disabled = false;
        }
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener("click", async () => {
        if (comment.commentId) {
          dislikeBtn.disabled = true;
          await handleVoteComment("dislike", i, comment.commentId);
          dislikeBtn.disabled = false;
        }
      });
    }
  });
}

async function handleVoteComment(type, idx, idComm) {
  if (!idComm) return;
  const isLike = type === "like";
  const field = isLike ? "isLiked" : "isDisliked";
  const oppField = isLike ? "isDisliked" : "isLiked";
  const counter = isLike ? "likes" : "dislikes";
  const oppCounter = isLike ? "dislikes" : "likes";

  // Fetch current vote state
  const { data: voteData, error: selectError } = await supabase
    .from("likedComments")
    .select("isLiked, isDisliked")
    .eq("userId", user.id)
    .eq("commentId", idComm)
    .single();

  // If no record, insert new with correct values
  if (selectError || !voteData) {
    const insertObj = {
      userId: user.id,
      commentId: idComm,
      isLiked: isLike,
      isDisliked: !isLike,
    };
    const { error: insertError } = await supabase
      .from("likedComments")
      .insert([insertObj]);
    if (insertError) {
      console.error("Error inserting data:", insertError);
      return;
    }
    await updateCommentVoteCounts(isLike, true, false, idx, idComm);
    return;
  }

  // Toggle logic: if already selected, unselect; if not, select and unselect the other
  const toggled = !voteData[field];
  const wasOppToggled = voteData[oppField];

  // Update likedComments
  const { error: updateError } = await supabase
    .from("likedComments")
    .update({ [field]: toggled, [oppField]: false })
    .eq("userId", user.id)
    .eq("commentId", idComm);

  if (updateError) {
    console.error("Error updating vote:", updateError);
    return;
  }

  await updateCommentVoteCounts(isLike, toggled, wasOppToggled, idx, idComm);
}

async function updateCommentVoteCounts(
  isLike,
  toggled,
  wasOppToggled,
  idx,
  idComm
) {
  const counter = isLike ? "likes" : "dislikes";
  const oppCounter = isLike ? "dislikes" : "likes";
  const buttonId = isLike ? `likeComment${idx}` : `dislikeComment${idx}`;
  const oppButtonId = isLike ? `dislikeComment${idx}` : `likeComment${idx}`;
  const button = document.getElementById(buttonId);
  const oppButton = document.getElementById(oppButtonId);
  const svg = isLike
    ? { default: SVG.like, toggled: SVG.liked }
    : { default: SVG.dislike, toggled: SVG.disliked };
  const oppSvg = isLike
    ? { default: SVG.dislike, toggled: SVG.disliked }
    : { default: SVG.like, toggled: SVG.liked };

  // Get current counts
  const { data: countData, error: countError } = await supabase
    .from("comments")
    .select("likes, dislikes")
    .eq("commentId", idComm)
    .single();

  if (countError || !countData) {
    console.error("Error fetching counts:", countError);
    return;
  }

  let newCount = countData[counter] || 0;
  let newOppCount = countData[oppCounter] || 0;

  // If toggled on, increment; if toggled off, decrement
  if (toggled) newCount += 1;
  else newCount -= 1;

  // If the opposite was previously toggled, decrement it
  if (wasOppToggled) newOppCount -= 1;

  // Ensure counts don't go below 0
  newCount = Math.max(0, newCount);
  newOppCount = Math.max(0, newOppCount);

  // Update counts in DB
  const { error: countUpdateError } = await supabase
    .from("comments")
    .update({ [counter]: newCount, [oppCounter]: newOppCount })
    .eq("commentId", idComm);

  if (countUpdateError) {
    console.error("Error updating counts:", countUpdateError);
    return;
  }

  // Update UI for both buttons
  if (button)
    button.innerHTML = `${toggled ? svg.toggled : svg.default} ${newCount}`;
  if (oppButton) oppButton.innerHTML = `${oppSvg.default} ${newOppCount}`;
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
  const oppField = isLike ? "isDisliked" : "isLiked";
  const counter = isLike ? "likes" : "dislikes";
  const oppCounter = isLike ? "dislikes" : "likes";
  const svg = isLike
    ? { default: SVG.like, toggled: SVG.liked }
    : { default: SVG.dislike, toggled: SVG.disliked };
  const oppSvg = isLike
    ? { default: SVG.dislike, toggled: SVG.disliked }
    : { default: SVG.like, toggled: SVG.liked };
  const button = document.getElementById(type);
  const oppButton = document.getElementById(isLike ? "dislike" : "like");

  // Fetch current vote state
  const { data: voteData, error: selectError } = await supabase
    .from("likedProducts")
    .select("isLiked, isDisliked")
    .eq("userId", user.id)
    .eq("reviewId", reviewID)
    .single();

  // If no record, insert new with correct values
  if (selectError || !voteData) {
    const insertObj = {
      userId: user.id,
      reviewId: reviewID,
      isLiked: isLike,
      isDisliked: !isLike,
    };
    const { error: insertError } = await supabase
      .from("likedProducts")
      .insert([insertObj]);
    if (insertError) {
      console.error("Error inserting data:", insertError);
      return;
    }
    await updateVoteCounts(isLike, true, false);
    return;
  }

  // Toggle logic: if already selected, unselect; if not, select and unselect the other
  const toggled = !voteData[field];
  const wasOppToggled = voteData[oppField];

  // Update likedProducts
  const { error: updateError } = await supabase
    .from("likedProducts")
    .update({ [field]: toggled, [oppField]: false })
    .eq("userId", user.id)
    .eq("reviewId", reviewID);

  if (updateError) {
    console.error("Error updating vote:", updateError);
    return;
  }

  await updateVoteCounts(isLike, toggled, wasOppToggled);
}

// Helper to update productReview counts and button UI
async function updateVoteCounts(isLike, toggled, wasOppToggled) {
  const counter = isLike ? "likes" : "dislikes";
  const oppCounter = isLike ? "dislikes" : "likes";
  const button = document.getElementById(isLike ? "like" : "dislike");
  const oppButton = document.getElementById(isLike ? "dislike" : "like");
  const svg = isLike
    ? { default: SVG.like, toggled: SVG.liked }
    : { default: SVG.dislike, toggled: SVG.disliked };
  const oppSvg = isLike
    ? { default: SVG.dislike, toggled: SVG.disliked }
    : { default: SVG.like, toggled: SVG.liked };

  // Get current counts
  const { data: countData, error: countError } = await supabase
    .from("productReview")
    .select("likes, dislikes")
    .eq("reviewId", reviewID)
    .single();

  if (countError || !countData) {
    console.error("Error fetching counts:", countError);
    return;
  }

  let newCount = countData[counter];
  let newOppCount = countData[oppCounter];

  // If toggled on, increment; if toggled off, decrement
  if (toggled) newCount += 1;
  else newCount -= 1;

  // If the opposite was previously toggled, decrement it
  if (wasOppToggled) newOppCount -= 1;

  // Update counts in DB
  const { error: countUpdateError } = await supabase
    .from("productReview")
    .update({ [counter]: newCount, [oppCounter]: newOppCount })
    .eq("reviewId", reviewID);

  if (countUpdateError) {
    console.error("Error updating counts:", countUpdateError);
    return;
  }

  // Update UI
  button.innerHTML = `${toggled ? svg.toggled : svg.default} ${newCount}`;
  oppButton.innerHTML = `${oppSvg.default} ${newOppCount}`;
}

// Create a function to show feedback messages
function showMessage(message, isError = false) {
  const existingMsg = document.getElementById("commentFeedback");
  if (existingMsg) existingMsg.remove();

  const msgElement = document.createElement("div");
  msgElement.id = "commentFeedback";
  msgElement.style.padding = "10px";
  msgElement.style.marginTop = "10px";
  msgElement.style.borderRadius = "4px";
  msgElement.style.backgroundColor = isError ? "#ffe6e6" : "#e6ffe6";
  msgElement.style.color = isError ? "#cc0000" : "#008000";
  msgElement.textContent = message;

  const commentBox = document.getElementById("sendComment");
  commentBox.parentNode.insertBefore(msgElement, commentBox.nextSibling);

  // Auto-hide message after 5 seconds
  setTimeout(() => msgElement.remove(), 5000);
}

// Initialize comment submission functionality
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners for comment submission
  const submitButton = document.getElementById("sendComment");
  const commentInput = document.getElementById("newComment");

  if (!submitButton || !commentInput) {
    console.error("Comment form elements not found");
    return;
  }

  const handleSubmit = async () => {
    const commentText = commentInput.value.trim();

    // Validate input
    if (commentText === "") {
      showMessage("Please enter a comment", true);
      return;
    }

    if (commentText.length < 2) {
      showMessage("Comment is too short", true);
      return;
    }

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Posting...";

    try {
      const { error: submissionError } = await supabase
        .from("comments")
        .insert([
          {
            reviewId: reviewID,
            userId: user.id,
            comment: commentText,
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
          },
        ]);

      if (submissionError) {
        throw submissionError;
      }

      // Clear input and show success message
      commentInput.value = "";
      showMessage("Comment posted successfully!");

      // Refresh comments without full page reload
      const { data: newComments, error: refreshError } = await supabase
        .from("comments")
        .select("*")
        .eq("reviewId", reviewID);

      if (!refreshError && newComments) {
        await initComments(newComments);
      } else {
        location.reload(); // Fallback to page reload if refresh fails
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      showMessage("Failed to post comment. Please try again.", true);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    }
  }; // Add click event listener
  submitButton.addEventListener("click", () => handleSubmit());

  // Add enter key press event listener
  commentInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  });
});
