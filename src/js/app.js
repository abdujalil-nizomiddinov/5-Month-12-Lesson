const $ = (e) => document.querySelector(e);
const $$ = (es) => document.querySelectorAll(es);

const time = $(".time");
const next = $(".next");
const prev = $(".back");
const carousel = $(".carousel-inner");

const max = 3;
let activeIndex = 0;
const discountSeconds = 12 * 3600 + 25 * 60 + 32;

if (!localStorage.getItem("discountStart")) {
  const startTime = Date.now();
  localStorage.setItem("discountStart", startTime);
}
let timer;

function updateTimer() {
  const startTime = parseInt(localStorage.getItem("discountStart"), 10);
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  let remaining = discountSeconds - elapsedSeconds;

  if (remaining <= 0) {
    remaining = 0;
    clearInterval(timer);
    localStorage.setItem("discountTime", "00:00:00");
    time.textContent = "00:00:00";
    time.style.color = "red";
    return;
  }

  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");

  const timeString = `${h}:${m}:${s}`;
  localStorage.setItem("discountTime", timeString);
  time.textContent = timeString;
}

timer = setInterval(updateTimer, 700);
updateTimer();

next.addEventListener("click", () => {
  activeIndex = (activeIndex + 1) % max;
  animate();
});

prev.addEventListener("click", () => {
  activeIndex = (activeIndex - 1 + max) % max;
  animate();
});

setInterval(() => {
  activeIndex = (activeIndex + 1) % max;
  animate();
}, 3000);

const animate = () => {
  carousel.style.transform = `translateX(-${activeIndex * 100}%)`;
};

const cardBox = document.querySelector(".card-box");

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    const products = data.products.slice(0, 30);
    cardBox.innerHTML = "";
    products.forEach((product) => {
      const discountedPrice = (product.price / 2).toFixed(2);

      cardBox.innerHTML += `
        <div
          class="mb-[20px] cursor-pointer max-w-sm p-4 bg-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 ease-out shadow-[0_0_10px_0.1px_gray] hover:shadow-[0_0_20px_0.5px_gray]"
        >
          <div class="overflow-hidden rounded-tl-xl rounded-tr-xl">
            <img
              src="${product.thumbnail}"
              alt="${product.title}"
              class="w-full object-cover hover:scale-110 transition-all duration-500 ease-out"
            />
          </div>
          <div class="px-2 pt-4">
            <h2 class="text-3xl max-[575px]:text-lg font-semibold mb-2 line-clamp-1 select-none"
                onclick="this.classList.toggle('line-clamp-1')"
            >${product.title}</h2>
            <p class="text-gray-600 mb-4 line-clamp-2 select-none max-[575px]:text-xs"
               onclick="this.classList.toggle('line-clamp-2')"
            >
              ${product.description}
            </p>
            <div class="mx-2 my-2 flex flex-col gap-0">
              <del class="text-sm max-[575px]:text-xs font-mono text-gray-400">$${product.price}</del>
              <p class="text-2xl max-[575px]:text-lg font-mono text-red-700">$${discountedPrice}</p>
            </div>
            <div class="flex space-x-4">
              <button
                class="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                onclick="console.log(${product.id})"
              >
                Buy
              </button>
              <button
                class="bg-gray-200 p-2 rounded-xl hover:bg-gray-300 transition"
                onclick="console.log(${product.id})"
              >
                <i class="fa-solid fa-cart-shopping text-gray-700"></i>
              </button>
            </div>
          </div>
        </div>
        `;
    });
  });
