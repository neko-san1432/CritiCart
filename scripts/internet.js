window.addEventListener("online", () => {
    document.getElementById("msgnet").style.display = "none";
    const loadingText = document.getElementById("recon");
    loadingText.textContent = "Reconnected!";
    setTimeout(() => {
        document.getElementById("offline").style.display = "none";
    }, 2000);
});

window.addEventListener("offline", () => {
  document.getElementById("offline").style.display = "block";
  const loadingText = document.getElementById("recon");
  let dotCount = 0;

  setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    loadingText.textContent = "Reconnecting" + ".".repeat(dotCount);
  }, 500);
});

