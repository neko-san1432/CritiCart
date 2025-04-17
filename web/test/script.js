const leftPanel = document.querySelector('.left-panel');
const toggleButton = document.getElementById('togglePanel');

toggleButton.addEventListener('click', () => {
    leftPanel.classList.toggle('collapsed');
});
