const swiper = new Swiper(".swiper", {
  // Optional parameters
  slidesPerView: window.innerWidth > 767 ? 2 : 1,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: true,
  // Navigation arrows
  navigation: {
    nextEl: ".btn__right",
    prevEl: ".btn__left",
  },
});

document.querySelector("#burger").addEventListener("click", () => {
  document.querySelector("#menu").classList.toggle("open");
});

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 1000,
  });
});
