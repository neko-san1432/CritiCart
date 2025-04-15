const slider = document.querySelector('.scroll-container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
});

slider.addEventListener('mouseup', () => {
    isDown = false;
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();  // Prevent text highlight
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // adjust scroll speed
    slider.scrollLeft = scrollLeft - walk;
});
