const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const filePreviews = document.getElementById('filePreviews');
const uploadInstructions = document.getElementById('uploadInstructions');
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export let filesArray = [];

// Handle file selection
fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
  fileInput.value = ''; // Reset to allow re-uploading same files
});

// Drag and drop events
['dragover', 'dragenter'].forEach(event => {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
});

['dragleave', 'dragend', 'drop'].forEach(event => {
  dropZone.addEventListener(event, () => {
    dropZone.classList.remove('drag-over');
  });
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
});

// Handle the files
function handleFiles(files) {
  if (!files || files.length === 0) return;
  
  // Convert FileList to array and filter valid files
  const validFiles = Array.from(files).filter(file => {
    const isValidType = file.type.match('image/(jpeg|png)');
    const isValidSize = file.size <= MAX_FILE_SIZE;
    
    if (!isValidType) {
      showError('Only JPG/PNG images are allowed');
      return false;
    }
    
    if (!isValidSize) {
      showError(`File ${file.name} exceeds 5MB limit`);
      return false;
    }
    
    return true;
  });
  
  // Check file limit
  if (filesArray.length + validFiles.length > MAX_FILES) {
    showError(`Maximum ${MAX_FILES} images allowed (${filesArray.length} already added)`);
    return;
  }
  
  // Add new files
  validFiles.forEach(file => {
    if (filesArray.length < MAX_FILES) {
      filesArray.push(file);
      createFilePreview(file);
    }
  });
  
  // Update UI
  updateUploadUI();
}

// Create file preview element
function createFilePreview(file) {
  const preview = document.createElement('div');
  preview.className = 'file-preview';
  
  const thumbnail = document.createElement('img');
  thumbnail.className = 'file-thumbnail';
  thumbnail.src = URL.createObjectURL(file);
  thumbnail.alt = file.name;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '×';
  deleteBtn.title = 'Remove image';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeFile(file, preview);
  });
  
  const fileInfo = document.createElement('div');
  fileInfo.className = 'file-info';
  fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
  
  preview.appendChild(thumbnail);
  preview.appendChild(deleteBtn);
  preview.appendChild(fileInfo);
  filePreviews.appendChild(preview);
}

// Remove file from list
function removeFile(file, previewElement) {
  filesArray = filesArray.filter(f => f !== file);
  previewElement.classList.add('removing');
  
  // Add animation before removing
  setTimeout(() => {
    filePreviews.removeChild(previewElement);
    URL.revokeObjectURL(previewElement.querySelector('img').src);
    updateUploadUI();
  }, 300);
}

// Update UI based on current files
function updateUploadUI() {
  if (filesArray.length > 0) {
    uploadInstructions.style.display = 'none';
  } else {
    uploadInstructions.style.display = 'block';
  }
}

// Show error message
function showError(message) {
  const error = document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  
  // Remove previous error if exists
  const existingError = dropZone.querySelector('.error-message');
  if (existingError) {
    dropZone.removeChild(existingError);
  }
  
  dropZone.appendChild(error);
  
  // Auto-remove error after 5 seconds
  setTimeout(() => {
    if (error.parentNode) {
      error.classList.add('fading');
      setTimeout(() => dropZone.removeChild(error), 300);
    }
  }, 5000);
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}