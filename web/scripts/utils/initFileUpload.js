const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const filePreviews = document.getElementById('filePreviews');
const uploadInstructions = document.getElementById('uploadInstructions');
const MAX_FILES = 5;
let filesArray = [];

// Handle file selection
fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

// Drag and drop events
['dragover', 'dragenter'].forEach(event => {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
});

['dragleave', 'dragend'].forEach(event => {
  dropZone.addEventListener(event, () => {
    dropZone.classList.remove('drag-over');
  });
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

// Handle the files
function handleFiles(files) {
  // Convert FileList to array and filter images (excluding GIFs)
  const newFiles = Array.from(files).filter(file => 
    file.type.startsWith('image/') && !file.type.endsWith('gif')
  );
  
  // Check if any GIFs were attempted
  const gifFiles = Array.from(files).filter(file => 
    file.type.endsWith('gif')
  );
  
  if (gifFiles.length > 0) {
    showError('GIF files are not allowed');
  }
  
  // Check file limit
  if (filesArray.length + newFiles.length > MAX_FILES) {
    showError(`Maximum ${MAX_FILES} images allowed`);
    return;
  }
  
  // Add new files
  newFiles.forEach(file => {
    if (filesArray.length < MAX_FILES) {
      filesArray.push(file);
      createFilePreview(file);
    }
  });
  
  // Hide instructions if we have files
  if (filesArray.length > 0) {
    uploadInstructions.style.display = 'none';
  }
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
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeFile(file, preview);
  });
  
  preview.appendChild(thumbnail);
  preview.appendChild(deleteBtn);
  filePreviews.appendChild(preview);
}

// Remove file from list
function removeFile(file, previewElement) {
  filesArray = filesArray.filter(f => f !== file);
  filePreviews.removeChild(previewElement);
  URL.revokeObjectURL(previewElement.querySelector('img').src);
  
  // Show instructions if no files left
  if (filesArray.length === 0) {
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
  
  // Auto-remove error after 3 seconds
  setTimeout(() => {
    if (error.parentNode) {
      dropZone.removeChild(error);
    }
  }, 3000);
}