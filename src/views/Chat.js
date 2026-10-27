import { sendMessage } from "../utils/api.js";
import { characters, getCharacter } from "../data/characters.js";

// Un historial por personaje, se mantiene mientras la página esté abierta
const histories = {};

export function Chat(characterId = "leon") {
  const character = getCharacter(characterId) || characters[0];
  if (!histories[character.id]) {
    histories[character.id] = [{ role: "model", text: character.greeting }];
  }
  const history = histories[character.id];

  const el = document.createElement("section");
  el.className = `chat chat-${character.id}`;
  el.innerHTML = `
    <div class="char-tabs">
      ${characters
        .map(
          (c) => `<a href="/chat/${c.id}" data-link class="${c.id === character.id ? "active" : ""}">${c.emoji} ${c.name.split(" ")[0]}</a>`
        )
        .join("")}
    </div>
    <div class="chat-header">
      <div class="mini-badge">${character.emoji}</div>
      <div>
        <strong>${character.name}</strong><br />
        <small>${character.role} · ${character.status}</small>
      </div>
    </div>
    <div class="messages"></div>
    <form class="chat-form">
      <input type="text" placeholder="Escribile a ${character.name.split(" ")[0]}..." autocomplete="off" required />
      <button class="btn" type="submit">Enviar</button>
    </form>
  `;

  const messagesEl = el.querySelector(".messages");
  const form = el.querySelector(".chat-form");
  const input = el.querySelector("input");

  function addMessage(text, who) {
    const msg = document.createElement("div");
    msg.className = `msg ${who}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  history.forEach((m) => addMessage(m.text, m.role === "user" ? "user" : "bot"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    history.push({ role: "user", text });
    input.value = "";
    input.disabled = true;

    const typing = addMessage(`${character.name.split(" ")[0]} está escribiendo...`, "bot typing");

    try {
      const reply = await sendMessage(character.id, history);
      typing.remove();
      addMessage(reply, "bot");
      history.push({ role: "model", text: reply });
    } catch (err) {
      typing.remove();
      addMessage("Se cortó la comunicación. Probá de nuevo en un momento.", "bot");
      console.error(err);
    } finally {
      input.disabled = false;
      input.focus();
    }
  });

  return el;
}
