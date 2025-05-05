const errorPanel = document.getElementById('errorPane');

export function showError(message, width, height) {
  // Clear any existing timeout
  clearTimeout(errorPanel._timeout);

  // Create or reuse the error div
  let show = document.getElementById('error');
  if (!show) {
    show = document.createElement('div');
    show.id = 'error';
    errorPanel.appendChild(show);
  }

  show.style.width = `${width}px`;
  show.style.height = `${height}px`;
  show.style.display = 'flex';
  show.style.justifyContent = 'center';
  show.style.alignItems = 'center';
  show.textContent = message;

  errorPanel.style.display = 'block';

  // Hide after 2 seconds
  errorPanel._timeout = setTimeout(() => {
    errorPanel.style.display = 'none';
    show.remove(); // remove only the error div, not the whole panel
  }, 2000);
}
