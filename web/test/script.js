const container = document.getElementById("ratingContainer");
const fill = document.getElementById("fill");
const statisfactionSentiment = [1, 2, 3, 4, 5];
var x = "";
container.addEventListener("mousemove", (e) => {
  if (!locked) {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    fill.style.width = `${percentage * 100}%`;

    const rating = (percentage * 5).toFixed(1);
    if (rating >= 0 && rating <= 0.9) {
      x = "Extremely not satisfied";
    } else if (rating >= 1 && rating <= 1.9) {
      x = "Not satisfied";
    } else if (rating >= 2 && rating <= 2.9) {
      x = "Moderately satisfied";
    } else if (rating >= 3 && rating <= 3.9) {
      x = "Satisfied";
    } else if (rating >= 4 && rating <= 5) {
      x = "Extremely satisfied";
    }
    document.getElementById("rating").innerHTML =
      "Rating: " + rating + "<br/>" + "Satisfaction sentiment: " + x;
  }
});

container.addEventListener("mouseleave", () => {
  if (!locked) {
    fill.style.width = `0%`;
    console.log("Rating reset to 0.0");
  }
});
let locked = false;

container.addEventListener("click", () => {
  locked = !locked;
});
