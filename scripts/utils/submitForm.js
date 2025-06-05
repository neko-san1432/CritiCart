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
  if (!reviewID || !document.getElementById('submit-review')) return;

  try {
    // Fetch review data
    const { data: review, error: reviewError } = await supabase
      .from('productReview')
      .select('*')
      .eq('reviewId', reviewID)
      .single();    if (reviewError) throw reviewError;
    
    // Populate form fields
    const pnameField = document.getElementById('pname');
    const descField = document.getElementById('description');
    const linkField = document.getElementById('product-link');
    
    if (pnameField) pnameField.value = review.productName;
    if (descField) descField.value = review.productDescription;
    if (linkField) linkField.value = review.productURL;
      // Set selected category
    if (review.productType) {
      // Dispatch a category change event instead of direct assignment
      const categoryChangeEvent = new CustomEvent('categoryChange', {
        detail: { category: review.productType }
      });
      document.dispatchEvent(categoryChangeEvent);
      
      // Update dropdown UI
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
      console.log("Found existing images:", imageData);
      for (const image of imageData) {
        const { data: signedUrl } = await supabase.storage
          .from('productimages')
          .createSignedUrl(image.imgPath, 3600);
          
        if (signedUrl) {
          console.log("Got signed URL for image:", signedUrl);
          // Add to file preview using the fileUploadFunc's addFileToPreview
          const response = await fetch(signedUrl.signedUrl);
          const blob = await response.blob();
          const file = new File([blob], image.imgPath.split('/').pop(), { type: blob.type });
          filesArray.push(file);
          const previewsDiv = document.getElementById('filePreviews');          if (previewsDiv) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'file-preview';
            const img = document.createElement('img');
            img.src = signedUrl.signedUrl;
            img.alt = "Preview";
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.dataset.path = image.imgPath;            deleteBtn.addEventListener('click', async (e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to remove this image?')) {
                try {
                  // Remove from Supabase storage
                  const { error: deleteError } = await supabase.storage
                    .from('productimages')
                    .remove([image.imgPath]);
                  
                  if (deleteError) {
                    throw new Error('Failed to delete image from storage: ' + deleteError.message);
                  }
                  
                  // Remove from database
                  const { error: dbError } = await supabase
                    .from('productImages')
                    .delete()
                    .eq('imgPath', image.imgPath);
                    
                  if (dbError) {
                    throw new Error('Failed to delete image from database: ' + dbError.message);
                  }
                  
                  // Remove from UI with animation
                  imgContainer.style.transition = 'opacity 0.3s ease';
                  imgContainer.style.opacity = '0';
                  setTimeout(() => {
                    imgContainer.remove();
                    filesArray = filesArray.filter(f => f.name !== image.imgPath.split('/').pop());
                  }, 300);
                } catch (error) {
                  console.error('Error deleting image:', error);
                  alert('Failed to delete image: ' + error.message);
                }
              }
            });
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            previewsDiv.appendChild(imgContainer);
          }
        } else {
          console.error("Failed to get signed URL for image:", image.imgPath);
        }
      }
    } else {
      console.warn("No existing images found or error:", imageError);
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
    category: selectedCategory
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
    window.location.href = '../pages/main-menu.html';
  }, 2000);
});

// Upload images to Supabase Storage
async function insertPictures(reviewId) {
  const reviewFolder = `${reviewId}`;
    // If editing, first delete existing images
  if (isEdit) {
    const { data: existingImages } = await supabase
      .from('productImages')
      .select('imgPath')
      .eq('reviewId', reviewId);
    
    if (existingImages && existingImages.length > 0) {
      // Delete files from storage
      const filesToDelete = existingImages.map(img => img.imgPath);
      const { error: deleteError } = await supabase.storage
        .from("productimages")
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

  // Upload new images  const uploadedFiles = [];
  for (const file of filesArray) {
    const timestamp = Date.now();
    const filePath = `${reviewId}/${file.name}`;
    
    const { error: uploadError } = await supabase.storage      .from("productimages")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("⚠️ Error uploading image:", file.name, uploadError);
      continue;
    }    // Store file information in the database
    const { error: dbError } = await supabase
      .from("productImages")
      .insert([{
        reviewId: reviewId,
        imgPath: filePath,
        category: selectedCategory
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
