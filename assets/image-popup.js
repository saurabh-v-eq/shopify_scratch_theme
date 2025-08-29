document.addEventListener("DOMContentLoaded", () => {
  const popupModal = document.getElementById("image-popup-modal");
  const popupImage = document.getElementById("popup-image");
  const popupClose = document.getElementById("image-popup-close");

  document.body.addEventListener("click", (e) => {
    const link = e.target.closest(".image-preview-link");
    if (link) {
      e.preventDefault();
      const imageurl = link.getAttribute("data-image-url");
      popupImage.src = imageurl;
      popupModal.classList.remove("hidden");
    }
  });

  function hidePopup() {
    popupModal.classList.add("hidden");
    popupImage.src = '';
  }

  popupClose.addEventListener("click", hidePopup);

  popupModal.addEventListener("click", (e) => {
    if (e.target === popupModal) hidePopup();
  });
});
