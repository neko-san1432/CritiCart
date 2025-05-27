function setupRating({
  containerId,
  fillId,
  outputId,
  ratingVarRef,
  lockedRef,
}) {
  const container = document.getElementById(containerId);
  const fill = document.getElementById(fillId);
  const output = document.getElementById(outputId);
  let locked = false;
  let sentiment = "";

  container.addEventListener("mousemove", (e) => {
    if (!locked) {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
      const rating = (percentage * 5).toFixed(1);
      fill.style.width = `${percentage * 100}%`;

      ratingVarRef.value = rating;

      if (rating >= 0 && rating <= 0.9) sentiment = "Extremely not satisfied";
      else if (rating >= 1 && rating <= 1.9) sentiment = "Not satisfied";
      else if (rating >= 2 && rating <= 2.9) sentiment = "Moderately satisfied";
      else if (rating >= 3 && rating <= 3.9) sentiment = "Satisfied";
      else if (rating >= 4 && rating <= 5) sentiment = "Extremely satisfied";
      if (containerId == "ratingContainer") {
        output.innerHTML =
          "Price rating: " +
          rating +
          "<br/>Satisfaction sentiment: " +
          sentiment;
      } else {
        output.innerHTML =
          "Quality rating: " +
          rating +
          "<br/>Satisfaction sentiment: " +
          sentiment;
      }
    }
  });

  container.addEventListener("mouseleave", () => {
    if (containerId == "ratingContainer") {
      if (!locked) {
        fill.style.width = `0%`;
        output.innerHTML =
          '<span id="rating"> Price rating: 0.0 <br/> Satisfaction Sentiment: --- </span>';
      }
    } else {
      if (!locked) {
        fill.style.width = `0%`;
        output.innerHTML =
          '<span id="rating1"> Quality rating: 0.0 <br/> Satisfaction Sentiment: --- </span>';
      }
    }
  });

  container.addEventListener("click", () => {
    locked = !locked;
    output.innerHTML =
      "Rating: " +
      ratingVarRef.value +
      "<br/>Satisfaction sentiment: " +
      sentiment;
  });

  // Store locked state externally if needed
  lockedRef.value = locked;
}

// Exported rating values
export let ratingPrice = 0;
export let ratingQuality = 0;

export function setRatings(quality, price) {
  ratingQuality = quality;
  ratingPrice = price;

  // Update the UI to reflect the ratings
  const qualityFill = document.getElementById("fill1");
  const priceFill = document.getElementById("fill");
  const qualityOutput = document.getElementById("rating1");
  const priceOutput = document.getElementById("rating");

  if (qualityFill && qualityOutput) {
    qualityFill.style.width = `${(quality / 5) * 100}%`;
    let qualitySentiment = getSentiment(quality);
    qualityOutput.innerHTML = `Quality rating: ${quality}<br/>Satisfaction sentiment: ${qualitySentiment}`;
  }

  if (priceFill && priceOutput) {
    priceFill.style.width = `${(price / 5) * 100}%`;
    let priceSentiment = getSentiment(price);
    priceOutput.innerHTML = `Price rating: ${price}<br/>Satisfaction sentiment: ${priceSentiment}`;
  }
}

function getSentiment(rating) {
  if (rating >= 0 && rating <= 0.9) return "Extremely not satisfied";
  else if (rating >= 1 && rating <= 1.9) return "Not satisfied";
  else if (rating >= 2 && rating <= 2.9) return "Moderately satisfied";
  else if (rating >= 3 && rating <= 3.9) return "Satisfied";
  else if (rating >= 4 && rating <= 5) return "Extremely satisfied";
  return "---";
}

// Run setup
setupRating({
  containerId: "ratingContainer",
  fillId: "fill",
  outputId: "rating",
  ratingVarRef: { value: ratingPrice },
  lockedRef: { value: false },
});

setupRating({
  containerId: "ratingContainer1",
  fillId: "fill1",
  outputId: "rating1",
  ratingVarRef: { value: ratingQuality },
  lockedRef: { value: false },
});
