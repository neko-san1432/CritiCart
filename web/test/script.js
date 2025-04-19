const container = document.getElementById('ratingContainer');
const fill = document.getElementById('fill');

container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    fill.style.width = `${percentage * 100}%`;

    const rating = (percentage * 5).toFixed(1);
    console.log(`Rating: ${rating}`);
});

container.addEventListener('mouseleave', () => {
    fill.style.width = `0%`; // Reset on mouse out
    console.log("Rating reset to 0.0");
});
