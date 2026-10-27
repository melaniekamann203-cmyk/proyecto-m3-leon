// Fondo de pantalla que va cambiando solo (crossfade entre dos capas)
const IMAGES = [
  "/img/fondo1.jpg",
  "/img/fondo2.jpg",
  "/img/fondo3.jpg",
  "/img/fondo4.jpg",
  "/img/fondo5.jpg",
  "/img/fondo6.jpg",
];

const INTERVAL = 7000; // milisegundos entre cada foto

export function initBackground() {
  const wrap = document.createElement("div");
  wrap.className = "bg-slideshow";
  wrap.innerHTML = `<div class="bg-layer show"></div><div class="bg-layer"></div><div class="bg-overlay"></div>`;
  document.body.prepend(wrap);

  // Precarga para que no parpadee
  IMAGES.forEach((src) => { new Image().src = src; });

  const layers = wrap.querySelectorAll(".bg-layer");
  let index = 0;
  let front = 0;
  layers[0].style.backgroundImage = `url(${IMAGES[0]})`;

  setInterval(() => {
    index = (index + 1) % IMAGES.length;
    const back = 1 - front;
    layers[back].style.backgroundImage = `url(${IMAGES[index]})`;
    layers[back].classList.add("show");
    layers[front].classList.remove("show");
    front = back;
  }, INTERVAL);
}
