const KEY = "leon-theme";

function apply(theme) {
  const btn = document.getElementById("theme-toggle");
  document.body.classList.toggle("dark", theme === "dark");
  if (btn) btn.textContent = theme === "dark" ? "☀ Modo claro" : "☾ Modo oscuro";
}

export function initTheme() {
  let saved = "light";
  try { saved = localStorage.getItem(KEY) || "light"; } catch {}
  apply(saved);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    apply(next);
    try { localStorage.setItem(KEY, next); } catch {}
  });
}
