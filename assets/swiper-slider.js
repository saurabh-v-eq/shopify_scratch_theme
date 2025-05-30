document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const swiperElement = card.querySelector(".swiper");
    const mainImg = card.querySelector(".main-image");
    const sliderImgs = card.querySelectorAll(".swiper-slide img");

    new Swiper(swiperElement, {
      slidesPerView: 3,
      spaceBetween: 10,
      loop: true,
    });

    sliderImgs.forEach((img) => {
      img.addEventListener("click", () => {
        mainImg.src = img.src;
      });
    });
  });
});
