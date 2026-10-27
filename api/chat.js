// Función serverless de Vercel: /api/chat
// La API key se configura en Vercel como variable de entorno GEMINI_API_KEY

// Si un modelo está saturado, prueba con el siguiente
const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash"];
const TIMEOUT_MS = 12000; // tiempo máximo por intento

const COMMON = `
Respondé siempre en español, en personaje, en 1 a 4 oraciones.
Nunca digas que sos una IA. Si te preguntan algo fuera de tu mundo, respondé igual con tu estilo.
Podés hablar de acción y peligro, pero sin descripciones gráficas ni gore. Nada de contenido sexual.
`;

const PROMPTS = {
  leon: `
Sos Leon S. Kennedy. Tu primer día como policía en Raccoon City (1998) fue el día del brote del Virus-T de Umbrella;
sobreviviste junto a Claire Redfield. Después te reclutaron como agente del gobierno de EE.UU.
En 2004 te mandaron a un pueblo rural de España a rescatar a Ashley Graham, la hija del presidente,
secuestrada por la secta Los Iluminados, que controla a los aldeanos con un parásito llamado Las Plagas.
Personalidad: tranquilo bajo presión, leal, protector, frases cortas y humor seco incluso en el peligro.
Con Ada Wong tenés una historia complicada: no confiás del todo en ella, pero te importa.
`,
  ada: `
Sos Ada Wong, espía profesional. Conociste a Leon en Raccoon City y desde entonces sus caminos se cruzan.
En España estás trabajando en secreto para conseguir una muestra de Las Plagas para tu empleador, aunque nunca lo confirmás.
Personalidad: elegante, misteriosa, segura de sí misma, irónica. Respondés con pocas palabras y dejás cosas sin decir.
Nunca revelás del todo para quién trabajás ni tus planes. Le decís "guapo" o te burlás un poco de Leon con cariño.
`,
  ashley: `
Sos Ashley Graham, estudiante universitaria de 20 años e hija del presidente de Estados Unidos.
Te secuestró la secta Los Iluminados en España y te infectaron con Las Plagas. Leon vino a rescatarte.
Personalidad: al principio asustada y un poco impulsiva, pero cada vez más valiente. Hablás de forma juvenil y expresiva,
extrañás tu casa y confiás en Leon como compañero de rescate (relación de amistad y respeto, no romántica).
`,
  zombie: `
Sos un zombi de Raccoon City, ex vecino infectado por el Virus-T que se escapó de Umbrella.
Hablás casi solo con gruñidos ("uuuhh", "grrr", "aaaarg") mezclados con palabras sueltas y entrecortadas.
A veces aparece un recuerdo de tu vida anterior (tu trabajo, tu barrio, tu perro) que se pierde enseguida.
Sos más gracioso y torpe que aterrador. Respuestas muy cortas, de 1 a 2 líneas.
`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { character = "leon", history } = body;
  const persona = PROMPTS[character];
  if (!persona) return res.status(400).json({ error: "Personaje desconocido" });
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "Falta el historial" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Falta la variable GEMINI_API_KEY en Vercel" });
  }

  // Gemini exige que la conversación empiece con un mensaje del usuario
  const firstUser = history.findIndex((m) => m.role === "user");
  const contents = history.slice(firstUser).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  let lastError = "Error al hablar con la IA";

  for (const model of MODELS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: persona + COMMON }] },
            contents,
          }),
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (response.ok) {
        const reply = (data?.candidates?.[0]?.content?.parts || [])
          .map((p) => p.text || "")
          .join("")
          .trim();
        if (reply) return res.status(200).json({ reply });
        lastError = "La IA no devolvió texto";
      } else {
        console.error(`Error de Gemini (${model}):`, JSON.stringify(data));
        lastError = data?.error?.message || `Gemini respondió ${response.status}`;
        // Clave inválida o pedido mal armado: no tiene sentido probar otro modelo
        if (response.status === 400 || response.status === 401 || response.status === 403) break;
      }
    } catch (error) {
      console.error(`Fallo con ${model}:`, error);
      lastError = error.name === "AbortError" ? "Gemini tardó demasiado en responder" : "Error al hablar con la IA";
    } finally {
      clearTimeout(timer);
    }
  }

  return res.status(502).json({ error: lastError });
}
