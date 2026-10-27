// Función serverless de Vercel: /api/chat
// La API key se configura en Vercel como variable de entorno GEMINI_API_KEY

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

  const { character = "leon", history } = req.body || {};
  const persona = PROMPTS[character];
  if (!persona) return res.status(400).json({ error: "Personaje desconocido" });
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "Falta el historial" });
  }

  try {
    const contents = history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: persona + COMMON }] },
          contents,
        }),
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sin señal. Intentá de nuevo.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al hablar con la IA" });
  }
}
