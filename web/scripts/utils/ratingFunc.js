const container = document.getElementById("ratingContainer");
const fill = document.getElementById("fill");
const statisfactionSentiment = [1, 2, 3, 4, 5];
var x = "";
let  ratingPrice = 0;
let locked = false;
container.addEventListener("mousemove", (e) => {
  if (!locked) {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    fill.style.width = `${percentage * 100}%`;

    ratingPrice = (percentage * 5).toFixed(1);
    if (ratingPrice >= 0 && ratingPrice <= 0.9) {
      x = "Extremely not satisfied";
    } else if (ratingPrice >= 1 && ratingPrice <= 1.9) {
      x = "Not satisfied";
    } else if (ratingPrice >= 2 && ratingPrice <= 2.9) {
      x = "Moderately satisfied";
    } else if (ratingPrice >= 3 && ratingPrice <= 3.9) {
      x = "Satisfied";
    } else if (ratingPrice >= 4 && ratingPrice <= 5) {
      x = "Extremely satisfied";
    }
    document.getElementById("rating").innerHTML =
      "Rating: " + ratingPrice + "<br/>" + "Satisfaction sentiment: " + x;
  }
});
container.addEventListener("mouseleave", () => {
  if (!locked) {
    fill.style.width = `0%`;
    document.getElementById("rating").innerHTML = "";
  }
});

container.addEventListener("click", () => {
  locked = !locked;
  document.getElementById("rating").innerHTML =
    "Rating: " + rating + "<br/>" + "Satisfaction sentiment: " + x;
});

const container1 = document.getElementById("ratingContainer1");
const fill1 = document.getElementById("fill1");

var y = "";
let  ratingQuality = 0;
let locked1 = false;
container.addEventListener("mousemove", (e) => {
  if (!locked) {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    fill1.style.width = `${percentage * 100}%`;

    ratingQuality = (percentage * 5).toFixed(1);
    if (ratingQuality >= 0 && rating <= 0.9) {
      y = "Extremely not satisfied";
    } else if (ratingQuality >= 1 && ratingQuality <= 1.9) {
      y = "Not satisfied";
    } else if (ratingQuality >= 2 && ratingQuality <= 2.9) {
      y = "Moderately satisfied";
    } else if (ratingQuality >= 3 && ratingQuality <= 3.9) {
      y = "Satisfied";
    } else if (ratingQuality >= 4 && ratingQuality <= 5) {
      y = "Extremely satisfied";
    }
    document.getElementById("rating").innerHTML =
      "Rating: " + ratingQuality + "<br/>" + "Satisfaction sentiment: " + x;
  }
});
container.addEventListener("mouseleave", () => {
  if (!locked) {
    fill1.style.width = `0%`;
    document.getElementById("rating").innerHTML = "";
  }
});

container1.addEventListener("click", () => {
  locked = !locked;
  document.getElementById("rating").innerHTML =
    "Rating: " + rating + "<br/>" + "Satisfaction sentiment: " + x;
});