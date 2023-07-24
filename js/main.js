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

const buttons = document.querySelectorAll(".infoBtn");

buttons.forEach((button, index) => {
  button.addEventListener("click", function () {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");

    const aspects = document.querySelectorAll(".aspect");

    aspects.forEach((aspect) => {
      aspect.classList.remove("show");
    });
    aspects[index].classList.add("show");
  });
});
