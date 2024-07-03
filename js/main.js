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

let carModels = [];

window.onload = function () {
  let today = new Date().toISOString().split("T")[0];
  document.querySelector('input[type="date"]').setAttribute("min", today);

  const carMenuEl = document.querySelector("#carMenu");
  for (let i = new Date().getFullYear(); i >= 1900; i--) {
    carMenuEl.innerHTML += `<div class="item" data-value="${i}">${i}</div>`;
  }

  fetch("/js/carModels.json")
    .then((data) => data.json())
    .then((data) => {
      carModels = data;
      data.forEach((car) => {
        document.querySelector(
          "#carMakes"
        ).innerHTML += `<div class="item" data-value="${car.brand}">${car.brand}</div>`;
      });
    });
};

function updateBrands(e) {
  const foundCar = carModels.find((car) => car.brand === e.target.value);
  document.querySelector("#carBrands").innerHTML = "";
  foundCar.models.forEach((model) => {
    document.querySelector(
      "#carBrands"
    ).innerHTML += `<div class="item" data-value="${model}">${model}</div>`;
  });
}

$("select.from.dropdown").dropdown();

$("select.to.dropdown").dropdown();

$(".transportationType").dropdown();
$(".makeType").dropdown();
$(".brandType").dropdown();

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

async function getFrom(value = "1", callback) {
  try {
    const response = await fetch(
      `https://truck-api-kappa.vercel.app/api/no-countries/${value}`
    );
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.log(error);
  }
}

async function getTo(value = "1", callback) {
  try {
    const response = await fetch(
      `https://truck-api-kappa.vercel.app/api/places/${value}`
    );
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.log(error);
  }
}

//? Quote
const quoteForm = document.querySelector("#quoteForm");
const fromList = document.querySelector("#fromList");
const toList = document.querySelector("#toList");
const fromWrapper = document.querySelector("#fromWrapper");
const toWrapper = document.querySelector("#toWrapper");
const termsCheckbox = quoteForm.querySelector("#terms");

termsCheckbox.addEventListener("change", () => {
  document.querySelector(".quote__form__btn").classList.toggle("disabled");
});

getFrom(undefined, (data) => {
  data.forEach((place) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = place.value;
    optionFrom.textContent = place.value;
    fromList.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = place.value;
    optionTo.textContent = place.value;
    toList.appendChild(optionTo);
  });
});

fromWrapper.querySelector("input.search").addEventListener(
  "keyup",
  debounce(
    (e) =>
      getFrom(e.target.value, (data) => {
        const menu = fromWrapper.querySelector(".menu");
        menu.innerHTML = "";
        data.forEach((place, idx) => {
          const div = document.createElement("div");
          if (idx === 0) div.classList.add("selected");
          div.classList.add("item");
          div.dataset.value = place.value;
          div.textContent = place.value;
          menu.appendChild(div);
        });
      }),
    500
  )
);

toWrapper.querySelector("input.search").addEventListener(
  "keyup",
  debounce(
    (e) =>
      getTo(e.target.value, (data) => {
        const menu = toWrapper.querySelector(".menu");
        menu.innerHTML = "";
        data.forEach((place, idx) => {
          const div = document.createElement("div");
          if (idx === 0) div.classList.add("selected");
          div.classList.add("item");
          div.dataset.value = place.value;
          div.textContent = place.value;
          menu.appendChild(div);
        });
      }),
    500
  )
);

const clientData = {
  step1: [],
  step2: [],
  step3: [],
  step4: [],
};

quoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const from = fromWrapper.querySelector(".menu .selected")?.dataset?.value;
  const to = toWrapper.querySelector(".menu .selected")?.dataset?.value;

  !from
    ? fromWrapper.classList.add("error")
    : fromWrapper.classList.remove("error");
  !to ? toWrapper.classList.add("error") : toWrapper.classList.remove("error");

  if (!from || !to) {
    return;
  }

  clientData.step1 = [
    { title: "From", data: from },
    { title: "To", data: to },
  ];

  if (e.target[4].checked) {
    document.querySelector(".quote__modal").classList.remove("visually-hidden");
    document.querySelector(".quote__modal").style.overflow = "scroll";
    document.body.style.overflow = "hidden";
  }
});

let activeStep = 0;

function nextStep() {
  const steps = document.querySelectorAll(".myStep");
  steps[activeStep].classList.remove("active");
  steps[activeStep].classList.add("completed");
  activeStep++;

  const allForms = document
    .querySelector(".steps__forms")
    .querySelectorAll("form");

  allForms.forEach((form, index) => {
    if (index === activeStep) {
      form.classList.remove("visually-hidden");
    } else {
      form.classList.add("visually-hidden");
    }
  });
}

function previousStep() {
  const steps = document.querySelectorAll(".myStep");

  if (activeStep > 0) {
    steps[activeStep].classList.remove("active");
    steps[activeStep - 1].classList.remove("completed");
    steps[activeStep - 1].classList.add("active");
    activeStep--;

    const allForms = document
      .querySelector(".steps__forms")
      .querySelectorAll("form");

    allForms.forEach((form, index) => {
      if (index === activeStep) {
        form.classList.remove("visually-hidden");
      } else {
        form.classList.add("visually-hidden");
      }
    });
  } else {
    document.querySelector(".quote__modal").classList.add("visually-hidden");
    document.querySelector(".quote__modal").style.overflow = "scroll";
    document.body.style.overflow = "auto";
  }
}

const quoteFormStep_0 = document.querySelector("#quoteStep_0");
const quoteFormStep_1 = document.querySelector("#quoteStep_1");
const quoteFormStep_2 = document.querySelector("#quoteStep_2");

quoteFormStep_0.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = e.target.querySelectorAll(".field");

  const transportationType = e.target[0];
  const shippingDate = e.target[1];

  transportationType.value
    ? fields[0].classList.remove("error")
    : fields[0].classList.add("error");
  shippingDate.value
    ? fields[1].classList.remove("error")
    : fields[1].classList.add("error");

  if (
    fields[0].classList.contains("error") ||
    fields[1].classList.contains("error")
  ) {
    return;
  }

  clientData.step2 = [
    {
      title: "Transportation type",
      data: transportationType.value,
    },
    {
      title: "Shipping date",
      data: shippingDate.value,
    },
  ];

  nextStep();
  console.log(clientData);
});

quoteFormStep_1.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = e.target.querySelectorAll(".field");

  const vehicleRuns = e.target[0];
  const year = e.target[1];
  const make = e.target[2];
  const model = e.target[3];

  vehicleRuns.value
    ? fields[0].classList.remove("error")
    : fields[0].classList.add("error");
  year.value
    ? fields[1].classList.remove("error")
    : fields[1].classList.add("error");
  make.value
    ? fields[2].classList.remove("error")
    : fields[2].classList.add("error");
  model.value
    ? fields[3].classList.remove("error")
    : fields[3].classList.add("error");

  if (
    fields[0].classList.contains("error") ||
    fields[1].classList.contains("error") ||
    fields[2].classList.contains("error") ||
    fields[3].classList.contains("error")
  ) {
    return;
  }

  clientData.step3 = [
    {
      title: "Vehicle runs",
      data: vehicleRuns.value,
    },
    {
      title: "Year",
      data: year.value,
    },
    {
      title: "Make",
      data: make.value,
    },
    {
      title: "Model",
      data: model.value,
    },
  ];

  const quoteTable = document.querySelector("#quoteTable");
  const messageData = [
    ...clientData.step1,
    ...clientData.step2,
    ...clientData.step3,
  ];
  quoteTable.innerHTML = "";
  messageData.forEach((item) => {
    quoteTable.innerHTML += `<li><span>${item.title}:</span> ${item.data}</li>`;
  });

  nextStep();
  console.log(clientData);
});

quoteFormStep_2.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = e.target.querySelectorAll(".field");

  const firstname = e.target[0];
  const lastname = e.target[1];
  const phone = e.target[2];
  const email = e.target[3];
  const comment = e.target[4];

  firstname.value
    ? fields[0].classList.remove("error")
    : fields[0].classList.add("error");
  lastname.value
    ? fields[1].classList.remove("error")
    : fields[1].classList.add("error");
  phone.value
    ? fields[2].classList.remove("error")
    : fields[2].classList.add("error");
  email.value
    ? fields[3].classList.remove("error")
    : fields[3].classList.add("error");

  if (
    fields[0].classList.contains("error") ||
    fields[1].classList.contains("error") ||
    fields[2].classList.contains("error") ||
    fields[3].classList.contains("error")
  ) {
    return;
  }

  clientData.step4 = [
    {
      title: "Firstname",
      data: firstname.value,
    },
    {
      title: "Surname",
      data: lastname.value,
    },
    {
      title: "Phone",
      data: phone.value,
    },
    {
      title: "Email",
      data: email.value,
    },
    {
      title: "Comment",
      data: comment.value,
    },
  ];

  document.querySelector(".quote__modal").classList.add("visually-hidden");
  document.body.style.overflow = "auto";
  sendMessage();
  alert("Your quote was recieved!");
  window.location.reload();
  console.log(clientData);
});

function sendMessage() {
  const id = "-1002148396491";
  const api = `https://api.telegram.org/bot7438402997:AAFr1FWMvR3i0gwtJb3FYSOJEPfOrsD91jM/sendMessage`;

  let message = "";
  const messageData = [
    ...clientData.step4,
    ...clientData.step1,
    ...clientData.step2,
    ...clientData.step3,
  ];
  messageData.forEach((item) => {
    message += `<b>${item.title}:</b> ${item.data}\n`;
  });

  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: id,
      parse_mode: "html",
      text: message,
    }),
  })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}