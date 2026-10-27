import { characters } from "../data/characters.js";

export function About() {
  const el = document.createElement("section");
  el.className = "about";
  el.innerHTML = `
    <h1>Acerca del proyecto</h1>
    <p>
      <strong>Agente Leon</strong> es una Single Page Application donde podés chatear con personajes
      de la saga Resident Evil. Las respuestas las genera una inteligencia artificial a la que se le
      indica la personalidad y la historia de cada personaje.
    </p>

    <h2>La historia</h2>
    <p>
      En 1998, un virus creado por la corporación Umbrella (el Virus-T) se escapa en Raccoon City y
      convierte a casi toda la ciudad en zombis. Leon S. Kennedy llega ese mismo día para su primer día
      como policía y logra sobrevivir. Ahí conoce a la misteriosa Ada Wong.
    </p>
    <p>
      Seis años después, Leon ya es agente del gobierno y lo envían a un pueblo rural de España para
      rescatar a Ashley Graham, la hija del presidente, secuestrada por una secta llamada Los Iluminados,
      que controla a los aldeanos con un parásito: Las Plagas. Ada vuelve a cruzarse en su camino,
      con sus propios planes.
    </p>

    <h2>Los personajes</h2>
    <ul>
      ${characters.map((c) => `<li><strong>${c.emoji} ${c.name}</strong> (${c.role}): ${c.bio}</li>`).join("")}
    </ul>

    <h2>¿Cómo funciona?</h2>
    <ul>
      <li>El usuario elige un personaje y escribe en la vista <em>Chat</em>.</li>
      <li>El frontend envía el personaje y el historial a una función serverless en <code>/api/chat</code>.</li>
      <li>La función le da a Gemini las instrucciones de ese personaje y devuelve la respuesta.</li>
      <li>La API key queda guardada en el servidor (variables de entorno de Vercel), nunca en el navegador.</li>
    </ul>

    <h2>Tecnologías</h2>
    <div class="tech">
      <span>HTML</span>
      <span>CSS</span>
      <span>JavaScript (ES6+)</span>
      <span>SPA con History API</span>
      <span>Gemini API</span>
      <span>Vercel Functions</span>
    </div>

    <h2>Autora</h2>
    <p>
      Melanie Kamann · Estudiante de Desarrollo Web Full Stack en Henry.<br />
      GitHub: <a href="https://github.com/melaniekamann203-cmyk" target="_blank" rel="noopener">melaniekamann203-cmyk</a>
    </p>

    <p style="margin-top:24px;color:var(--muted);font-size:.9rem">
      Proyecto de fan sin fines de lucro. Resident Evil y sus personajes pertenecen a sus respectivos dueños.
    </p>
  `;
  return el;
}
