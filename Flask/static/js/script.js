let previousData = null;

document.getElementById("generateChart").addEventListener("click", function () {
  fetch("http://127.0.0.1:5001/chart-data")
    .then((response) => response.json())
    .then((result) => {
      console.log("Fetched chart data:", result); // Debugging line

      // Check if the new data is different from the previous data
      if (
        previousData &&
        previousData.avg_prob_malicious === result.avg_prob_malicious &&
        previousData.avg_prob_normal === result.avg_prob_normal
      ) {
        console.log("Chart data is the same, no need to create a new chart.");
        return;
      }

      // Update the previous data
      previousData = result;

      // Remove old canvas if it exists
      const oldCanvas = document.getElementById("myChart");
      if (oldCanvas) {
        oldCanvas.remove();
      }

      // Check if chartContainer exists
      const chartContainer = document.getElementById("chartContainer");
      if (!chartContainer) {
        console.error("Error: chartContainer element not found");
        return;
      }

      // Create a new canvas element
      const newCanvas = document.createElement("canvas");
      newCanvas.id = "myChart";
      chartContainer.appendChild(newCanvas);

      const ctx = newCanvas.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Malicious", "Normal"],
          datasets: [
            {
              label: "Avg. Prediction Probability",
              data: [result.avg_prob_malicious, result.avg_prob_normal],
              backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(1, 62, 64, 1)"],
              borderColor: ["rgba(255, 99, 132, 0.8)", "rgba(1, 62, 64, 0.9)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: {
            duration: 1800,
            // animateScale: true,
            // animateRotate: true,
            onComplete: function () {
              updateLabels(result.avg_prob_malicious, result.avg_prob_normal);
            },
          },
          hover: {
            animationDuration: 0, // Disable hover animations
          },
        },
      });
    })
    .catch((error) => console.error("Error fetching chart data:", error));
});

function updateLabels(probMalicious, probNormal) {
  const labelContainer = document.getElementById("labelContainer");
  labelContainer.innerHTML = `
        <div class="label label-malicious">Malicious : ${probMalicious}%</div>
        <div class="label label-normal">Normal : ${probNormal}%</div>
    `;
}
