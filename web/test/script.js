document.getElementById('profile-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('profile-image').src = event.target.result;
      // Here you would typically upload to server
      // uploadProfilePicture(file);
    };
    reader.readAsDataURL(file);
  }
});