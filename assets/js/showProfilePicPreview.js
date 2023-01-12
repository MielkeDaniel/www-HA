let uploadButton;

function previewFile() {
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("profilePicture");

  const file = fileInput.files[0];
  const reader = new FileReader();

  if (!(file.type === "image/png" || file.type === "image/jpeg")) {
    alert("Please upload a valid image (jpeg or png) file.");
    return;
  }

  reader.onloadend = function () {
    preview.src = reader.result;
    const profileDropBox = document.getElementById("profileDropBox");
    profileDropBox.children[0].classList.add("hidden");

    uploadButton.removeAttribute("style");
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

function hideUploadButton() {
  uploadButton = document.getElementById("uploadProfilePicButtton");
  uploadButton.style.display = "none";
}

hideUploadButton();
