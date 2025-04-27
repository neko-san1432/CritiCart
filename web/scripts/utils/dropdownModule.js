const dropdown = document.querySelector('.custom-dropdown');
const toggle = dropdown.querySelector('.dropdown-toggle');
const pane = dropdown.querySelector('.dropdown-pane');
const options = pane.querySelectorAll('.dropdown-option');

toggle.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});

options.forEach(option => {
  option.addEventListener('click', () => {
    toggle.textContent = option.textContent + ' ▼';
    dropdown.classList.remove('active');
    console.log('Selected:', option.dataset.value);
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});