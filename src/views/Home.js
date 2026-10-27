import { characters } from "../data/characters.js";

export function Home() {
  const el = document.createElement("section");
  el.className = "hero";
  el.innerHTML = `
    <div class="badge">☣️</div>
    <h1>Sobreviví a la <span>conversación</span></h1>
    <p>
      Elegí un personaje de Resident Evil y chateá con él.
      Cada uno responde con su propia personalidad gracias a la inteligencia artificial.
    </p>

    <div class="cards">
      ${characters
        .map(
          (c) => `
        <a href="/chat/${c.id}" data-link class="card character-card">
          <div class="char-emoji">${c.emoji}</div>
          <h3>${c.name}</h3>
          <small class="char-role">${c.role}</small>
          <p>${c.bio}</p>
          <span class="btn btn-small">Chatear</span>
        </a>`
        )
        .join("")}
    </div>
  `;
  return el;
}
