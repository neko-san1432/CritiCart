import { filesArray } from "./fileUploadFunc.js";
import { ratingPrice, ratingQuality } from "./ratingFunc.js";
import { tags } from "./tagFunc.js";
import { supabase } from "../api/database.js";

let reviewID = 0;

document.getElementById("submit-review").addEventListener("click", async () => {
  // Get form values inside the click event
  const productDescription = document.getElementById("description").value;
  const productName = document.getElementById("pname").value;
  const productLink = document.getElementById("product-link").value;
  const productCategory = "food"; // Replace later with dropdown/input

  // Get logged in user
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();
  const user = sessionData?.user;
  if (sessionError || !user) {
    console.error("⚠️ User not logged in", sessionError);
    return;
  }
  // Insert review
  const { data: insertData, error: insertError } = await supabase
    .from("productReview")
    .insert([
      {
        userId: user.id,
        productType: productCategory,
        productURL: productLink,
        productName: productName,
        productDescription: productDescription,
        productRating: {
          qualityRating: ratingQuality,
          priceRating: ratingPrice,
        },
      },
    ])
    .select(); // So we can get the ID

  if (insertError || !insertData || insertData.length === 0) {
    console.error("❌ Error inserting review:", insertError);
    return;
  }

  reviewID = insertData[0].id;

  // Upload images
  await insertPictures(reviewID);
  // Insert tags
  await insertTags(reviewID);

  console.log("✅ Review submitted with ID:", reviewID);
  setInterval(() => {
    windows.location.href =
      window.location.origin + "/web/pages/main-menu.html";
  }, 5000);
});

// Upload images to Supabase Storage
async function insertPictures(reviewId) {
  for (const file of filesArray) {
    const filePath = `uploads/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("productimages")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) console.error("⚠️ Error uploading image:", file.name, error);
  }
}
// Insert tags
async function insertTags(reviewId) {
  for (const tag of tags) {
    const { error } = await supabase
      .from("tags")
      .insert([{ tag, reviewid: reviewId }]);
    if (error) console.error("⚠️ Error inserting tag:", tag, error);
  }
}
