/** Variables */
const header = document.querySelector(".nav-container"),
  navStyle = document.querySelector(".navbar"),
  media = window.matchMedia("(max-width:900px)"),
  brand = document.querySelector(".main-brand"),
  input = document.getElementById("input-file"),
  textUpload = document.getElementById("filename"),
  UploadContainer = document.getElementById("upload-container"),
  discardButton = document.getElementById("discard-file-butn"),
  submitBtn = document.getElementById("subButn"),
  resultBtn = document.getElementById("generateChart"),
  icon = document.getElementById("iconContainer");

/** Navbar closing on outside click - Jquery */
$(document).ready(function () {
  $(document).click(function () {
    $(".navbar-collapse").collapse("hide");
  });
  $(".navbar").on("click", "a", function () {
    $(".navbar a.active").removeClass("active");
    $(this).addClass("active");
  });
});

/** Function based on Scroll Event */
function handScroll(e) {
  if (window.scrollY > 50) {
    header.classList.add("bc");
    navStyle.style.setProperty("--bs-navbar-color", " whitesmoke");
    navStyle.style.setProperty("--bs-navbar-brand-color", " whitesmoke");
    navStyle.style.setProperty("--bs-navbar-active-color", " whitesmoke");
  } else {
    header.classList.remove("bc");
    header.style.transition = "all 0.7s ease";
    navStyle.style.setProperty("--bs-navbar-color", " #013e40");
    navStyle.style.setProperty("--bs-navbar-brand-color", " #013e40");
    navStyle.style.setProperty("--bs-navbar-active-color", " #013e40");
  }
}

/** Function based on MediaQuery */
function render(mq) {
  if (mq.matches) {
    window.removeEventListener("scroll", handScroll);
    brand.textContent = "ML-based DDoS Detection";
    header.classList.add("bc");
    navStyle.style.setProperty("--bs-navbar-color", " whitesmoke");
    navStyle.style.setProperty("--bs-navbar-brand-color", " whitesmoke");
    navStyle.style.setProperty("--bs-navbar-active-color", " whitesmoke");
  } else {
    window.addEventListener("scroll", handScroll);
    brand.textContent = "ML-based DDoS Attack Detection";
    header.classList.remove("bc");
    header.style.transition = "all 0.7s ease";
    navStyle.style.setProperty("--bs-navbar-color", " #013e40");
    navStyle.style.setProperty("--bs-navbar-brand-color", " #013e40");
    navStyle.style.setProperty("--bs-navbar-active-color", " #013e40");
  }
}
media.addEventListener("change", render);
render(media);

/** H1 Typerwriting */
document.addEventListener("DOMContentLoaded", function () {
  const text =
    "Using Machine Learning To Revolutionize the Detection of DDoS Attacks in IoT Environments.";
  const typewriterElement = document.getElementById("typewriter");
  let index = 0;

  // Wrap each letter in a span and add the cursor span
  typewriterElement.innerHTML =
    text
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("") + '<span id="cursor"></span>';

  const spans = typewriterElement.querySelectorAll("span:not(#cursor)");
  const cursor = document.getElementById("cursor");

  function typeEffect() {
    if (index < spans.length) {
      spans[index].style.opacity = 1;
      // Move the cursor to the position of the next character
      spans[index].after(cursor);
      index++;
      setTimeout(typeEffect, 90);
    } else {
      // After the text is fully revealed, start blinking for 5 seconds
      setTimeout(() => {
        cursor.style.display = "none"; // Hide cursor after 5 seconds
        clearInterval(blinkInterval);
      }, 5000);
    }
  }

  typeEffect();

  // Keep the cursor blinking while typing
  const blinkInterval = setInterval(() => {
    cursor.style.opacity = cursor.style.opacity === "1" ? "0" : "1";
  }, 500);
});

/** File Upload Functions */
input.addEventListener("change", (e) => {
  const uploadedFile = e.target.files[0];
  if (uploadedFile) {
    UploadContainer.style.visibility = "visible";
    textUpload.textContent = uploadedFile.name;
    submitBtn.disabled = false;
    submitBtn.classList.add("hover");
  } else {
    // UploadContainer.style.visibility = "hidden";
    textUpload.textContent = "";
    submitBtn.disabled = true;
    submitBtn.classList.remove("hover");
  }
});

/** Discard Button */
discardButton.addEventListener("click", () => {
  // Reset the file input value to empty
  input.value = "";
  textUpload.textContent = "";
  submitBtn.disabled = true;
  submitBtn.classList.remove("hover");
  resultBtn.disabled = true;
  UploadContainer.style.visibility = "hidden";
  // Reload the page
  location.reload();
});

// Function to trigger the modal
function showModal() {
  var myModal = new bootstrap.Modal(document.getElementById("myModal"));

  // Delay the modal display by 0.5 seconds.
  setTimeout(function () {
    myModal.show();
  }, 500);
}

/** Input file Max file size */
function validateFileSize(input) {
  const file = input.files[0];
  const maxSize = 3 * 1024 * 1024; // 2 MB
  console.log(file.size);

  if (file.size > maxSize) {
    input.value = ""; // Clear the file input
    showModal(); // Trigger the modal
  }
}

/** Main File*/
let processingInterval;
const MIN_PROCESSING_TIME = 2000; // Minimum time to show the processing animation (in milliseconds)

function animateProcessingDots() {
  const proText = document.querySelector(".pro-text");
  proText.style.color = "whitesmoke";
  let dotCount = 0;

  processingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3
    const dots = ".".repeat(dotCount);
    proText.innerHTML = `Processing <span id="dots">${dots}</span>`;
  }, 500);
}

function stopProcessingAnimation() {
  clearInterval(processingInterval);
}

function submitData(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const spinnerContainer = document.getElementById("spinnerContainer");
  const checkmark = document.getElementById("checkmark");
  const proText = document.querySelector(".pro-text");

  icon.style.display = "block";
  proText.style.opacity = 0; // Fade out current text
  setTimeout(() => {
    proText.style.fontSize = "1.25em";
    proText.style.height = "30px";
    proText.style.justifyContent = "flex-end";
    proText.style.flexDirection = "row";
    proText.innerHTML =
      'Processing <span style="margin-bottom:-5px" id="dots"></span>';
    proText.style.opacity = 1; // Fade in "Processing..."
    animateProcessingDots(); // Start animation
  }, 500);

  spinnerContainer.classList.remove("hidden");
  checkmark.classList.add("hidden");

  const startTime = Date.now();

  fetch("http://127.0.0.1:5001/predict", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json().then((data) => {
        if (response.ok) {
          // Handle the successful response
          console.log("Success:", data);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = MIN_PROCESSING_TIME - elapsedTime;
          setTimeout(
            () => {
              stopProcessingAnimation(); // Stop animation
              replaceSpinnerWithCheckIcon();
              resultBtn.disabled = false;
              resultBtn.classList.add("hover");
            },
            remainingTime > 0 ? remainingTime : 0
          );
        } else {
          // Handle the unsuccessful response
          console.log("No success:", data);
        }
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err.message);
      stopProcessingAnimation(); // Stop animation in case of error
    });
}

function replaceSpinnerWithCheckIcon() {
  const spinnerContainer = document.getElementById("spinnerContainer");
  const checkmark = document.getElementById("checkmark");
  const proText = document.querySelector(".pro-text");

  if (spinnerContainer && checkmark) {
    spinnerContainer.classList.add("hidden");
    checkmark.classList.remove("hidden");
    stopProcessingAnimation(); // Stop the animation
    proText.style.opacity = 0; // Fade out "Processing..."
    setTimeout(() => {
      proText.innerHTML = "Done";
      proText.style.opacity = 1; // Fade in "Done"
    }, 500);
  } else {
    console.error("Spinner container or checkmark not found!");
  }
}
function Results() {
  window.open("http://127.0.0.1:5001/pred", "_blank");
}

/** Cursor Animation */
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

function getEffectiveBackgroundColor(element) {
  let bgColor = window.getComputedStyle(element).backgroundColor;

  // Traverse up the DOM tree until we find a non-transparent background color
  while (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
    element = element.parentElement;
    if (!element) break; // No parent element, reached the root
    bgColor = window.getComputedStyle(element).backgroundColor;
  }

  return bgColor;
}

window.addEventListener("mousemove", function (e) {
  const posX = e.clientX;
  const posY = e.clientY;
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  cursorOutline.animate(
    {
      left: `${posX}px`,
      top: `${posY}px`,
    },
    { duration: 100, fill: "forwards" }
  );

  // Check the effective background color of the element under the cursor
  const elementUnderCursor = document.elementFromPoint(posX, posY);
  if (elementUnderCursor) {
    const elementBgColor = getEffectiveBackgroundColor(elementUnderCursor);

    // Check if the background color matches rgb(1, 62, 64)
    if (elementBgColor === "rgb(1, 62, 64)") {
      cursorOutline.style.borderColor = "whitesmoke";
      cursorDot.style.backgroundColor = "whitesmoke";
    } else {
      cursorOutline.style.borderColor = "#17260c";
      cursorDot.style.backgroundColor = "#3f6622";
    }
  }
});
