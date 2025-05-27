import { filesArray } from "./fileUploadFunc.js";
import { ratingPrice, ratingQuality, setRatings } from "./ratingFunc.js";
import { tags, addTag } from "./tagFunc.js";
import { selectedCategory } from "./dropdownModule.js";
import { supabase } from "../api/database.js";

let reviewID = 0;
const urlParams = new URLSearchParams(window.location.search);
const isEdit = urlParams.get('edit') === 'true';
reviewID = urlParams.get('reviewID');

// Function to fetch and populate review data
async function fetchReviewData() {
  if (!reviewID) return;

  try {
    // Fetch review data
    const { data: review, error: reviewError } = await supabase
      .from('productReview')
      .select('*')
      .eq('reviewId', reviewID)
      .single();

    if (reviewError) throw reviewError;

    // Populate form fields
    document.getElementById('pname').value = review.productName;
    document.getElementById('description').value = review.productDescription;
    document.getElementById('product-link').value = review.productURL;
    
    // Set selected category
    if (review.productType) {
      selectedCategory = review.productType;
      const dropdownButton = document.querySelector('.dropdown-toggle');
      const categoryOption = document.querySelector(`.dropdown-option[data-value="${review.productType}"]`);
      if (dropdownButton && categoryOption) {
        dropdownButton.textContent = categoryOption.textContent + ' ▼';
      }
    }
    
    // Set ratings
    if (review.productRating) {
      setRatings(review.productRating.qualityRating, review.productRating.priceRating);
    }

    // Load existing images
    const { data: imageData, error: imageError } = await supabase
      .from('productImages')
      .select('*')
      .eq('reviewId', reviewID);

    if (!imageError && imageData) {
      for (const image of imageData) {
        const { data: signedUrl } = await supabase.storage
          .from('product-images')
          .createSignedUrl(image.imgLink, 3600);
          
        if (signedUrl) {
          // Add to file preview using the fileUploadFunc's addFileToPreview
          const response = await fetch(signedUrl.signedUrl);
          const blob = await response.blob();
          const file = new File([blob], image.imgLink.split('/').pop(), { type: blob.type });
          filesArray.push(file);
          const previewsDiv = document.getElementById('filePreviews');
          if (previewsDiv) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'file-preview';
            imgContainer.innerHTML = `
              <img src="${signedUrl.signedUrl}" alt="Preview">
              <button class="remove-file" data-path="${image.imgLink}">×</button>
            `;
            previewsDiv.appendChild(imgContainer);
          }
        }
      }
    }

    // Fetch and set tags
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('tag')
      .eq('reviewid', reviewID);

    if (!tagError && tagData) {
      tagData.forEach(tag => addTag(tag.tag));
    }

    // Update submit button text
    document.getElementById('submit-review').textContent = 'Update Review';
  } catch (error) {
    console.error('Error fetching review data:', error);
  }
}

// Check if we're in edit mode and fetch data if needed
if (isEdit && reviewID) {
  fetchReviewData();
}

// Handle category changes
document.addEventListener('categoryChange', async (e) => {
  const newCategory = e.detail.category;
    
  // Update dropdown button text
  const dropdownButton = document.querySelector('.dropdown-toggle');
  const categoryOption = document.querySelector(`.dropdown-option[data-value="${newCategory}"]`);
  if (dropdownButton && categoryOption) {
    dropdownButton.textContent = categoryOption.textContent + ' ▼';
  }

  if (isEdit && filesArray.length > 0) {
    await moveFilesToNewCategory(reviewID, newCategory);
  }
});

document.getElementById("submit-review").addEventListener("click", async (e) => {
  e.preventDefault();
  // Get form values inside the click event
  const productDescription = document.getElementById("description").value;
  const productName = document.getElementById("pname").value;
  const productLink = document.getElementById("product-link").value;
  const productCategory = selectedCategory;

  // Get logged in user
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();
  const user = sessionData?.user;
  if (sessionError || !user) {
    console.error("⚠️ User not logged in", sessionError);
    return;
  }  // Prepare review data
  const reviewData = {
    userId: user.id,
    productType: productCategory,
    productURL: productLink,
    productName: productName,
    productDescription: productDescription,
    productRating: {
      qualityRating: ratingQuality,
      priceRating: ratingPrice,
    },
  };

  let result;
  if (isEdit && reviewID) {
    // Update existing review
    result = await supabase
      .from("productReview")
      .update(reviewData)
      .eq("reviewId", reviewID)
      .select();
  } else {
    // Insert new review
    result = await supabase
      .from("productReview")
      .insert([reviewData])
      .select();
  }

  const { data: insertData, error: insertError } = result;

  if (insertError || !insertData || insertData.length === 0) {
    console.error("❌ Error inserting review:", insertError);
    return;
  }
  reviewID = insertData[0].id;

  try {
    // Upload images first
    const uploadedFiles = await insertPictures(reviewID);
    console.log('Files uploaded:', uploadedFiles);
    
    // Then insert tags
    await insertTags(reviewID);
  } catch (error) {
    console.error('Error handling files or tags:', error);
    return;
  }
  console.log(`✅ Review ${isEdit ? 'updated' : 'submitted'} with ID:`, reviewID);
  setTimeout(() => {
    window.location.href = '../pages/your-reviewed-products.html';
  }, 2000);
});

// Upload images to Supabase Storage
async function insertPictures(reviewId) {
  const reviewFolder = `reviews/${reviewId}`;
  
  // If editing, first delete existing images
  if (isEdit) {
    const { data: existingImages } = await supabase
      .from('productImages')
      .select('imgLink')
      .eq('reviewId', reviewId);
    
    if (existingImages && existingImages.length > 0) {
      // Delete files from storage
      const filesToDelete = existingImages.map(img => img.imgLink);
      const { error: deleteError } = await supabase.storage
        .from("product-images")
        .remove(filesToDelete);
        
      if (deleteError) {
        console.error("Error deleting old images:", deleteError);
      }
      
      // Delete database records
      await supabase
        .from('productImages')
        .delete()
        .eq('reviewId', reviewId);
    }
  }

  // Upload new images
  const uploadedFiles = [];
  for (const file of filesArray) {
    const timestamp = Date.now();
    const filePath = `${reviewFolder}/${timestamp}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("⚠️ Error uploading image:", file.name, uploadError);
      continue;
    }

    // Store file information in the database
    const { error: dbError } = await supabase
      .from("productImages")
      .insert([{
        reviewId: reviewId,
        imgLink: filePath
      }]);

    if (dbError) {
      console.error("⚠️ Error storing image info:", dbError);
    } else {
      uploadedFiles.push(filePath);
    }
  }
  
  return uploadedFiles;
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

// Function to move files to a new category folder
async function moveFilesToNewCategory(reviewId, newCategory) {
  const reviewFolder = `reviews/${reviewId}`;
  console.log(`Moving files for review ${reviewId} to ${reviewFolder}`);
  // We're using review-specific folders now, so no need to move files
  return;
}
