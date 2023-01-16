let uploadButton;

function previewFile() {
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("imagePreview");
  const file = fileInput.files[0];
  const reader = new FileReader();

  if (!(file.type === "image/png" || file.type === "image/jpeg")) {
    alert("Please upload a valid image (jpeg or png) file.");
    return;
  }

  reader.onloadend = function () {
    preview.src = reader.result;
    const profileDropBox = document.getElementById("profileDropBox");
    uploadButton && profileDropBox.children[0].classList.add("hidden");
    uploadButton?.removeAttribute("style");
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

function main() {
  document.getElementById("fileInput")?.addEventListener("change", previewFile);
  uploadButton = document.getElementById("uploadProfilePicButtton");
  if (uploadButton) uploadButton.style.display = "none";
}

main();
