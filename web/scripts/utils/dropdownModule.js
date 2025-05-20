const dropdown = document.querySelector('.custom-dropdown');
if (dropdown) {
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const pane = dropdown.querySelector('.dropdown-pane');
  const options = pane ? pane.querySelectorAll('.dropdown-option') : [];

  if (toggle && pane && options.length > 0) {
    // Add ARIA attributes for accessibility
    toggle.setAttribute('aria-expanded', 'false');
    pane.setAttribute('role', 'menu');
    options.forEach(option => option.setAttribute('role', 'menuitem'));

    // Toggle dropdown visibility
    toggle.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default behavior
      const isExpanded = dropdown.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isExpanded);
    });

    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', () => {
        toggle.textContent = option.textContent + ' ▼';
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        console.log('Selected:', option.dataset.value);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  } else {
    console.error('Dropdown elements are missing or improperly configured.');
  }
}