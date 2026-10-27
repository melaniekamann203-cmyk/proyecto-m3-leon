import { Home } from "./views/Home.js";
import { Chat } from "./views/Chat.js";
import { About } from "./views/About.js";
import { initTheme } from "./utils/theme.js";
import { initBackground } from "./utils/background.js";

const routes = {
  "/": Home,
  "/home": Home,
  "/chat": Chat,
  "/about": About,
};

const app = document.getElementById("app");

export function render(path) {
  // Rutas con parámetro: /chat/leon, /chat/ada, /chat/ashley, /chat/zombie
  const [, section, param] = path.split("/");
  const base = "/" + (section || "");
  const view = routes[base] || Home;

  app.innerHTML = "";
  app.appendChild(view(param));
  window.scrollTo(0, 0);

  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === base);
  });
}

export function navigate(path) {
  window.history.pushState({}, "", path);
  render(path);
}

// Links internos sin recargar la página (SPA)
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href"));
  }
});

window.addEventListener("popstate", () => render(window.location.pathname));

initTheme();
initBackground();
render(window.location.pathname);
