const form = document.getElementById('protectedForm');
  let isFormDirty = false;

  // Watch for any user input
  form.addEventListener('input', () => {
    isFormDirty = true;
  });

  // When form is submitted, reset dirty flag
  form.addEventListener('submit', (e) => {
    isFormDirty = false;
    alert('Form successfully saved!');
  });

  // Warn user if they try to leave with dirty form
  window.addEventListener('beforeunload', (e) => {
    if (isFormDirty) {
      e.preventDefault();
      e.returnValue = ''; // Show browser's default warning
    }
  });