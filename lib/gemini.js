// Lógica pura para hablar con Gemini (sin fetch ni req/res),
// separada de la función serverless para poder testearla.

/**
 * Convierte el historial del chat al formato `contents` que pide Gemini.
 * Gemini exige que la conversación empiece con un mensaje del usuario,
 * así que se descartan los mensajes del modelo que estén antes del primero
 * (por ejemplo, el saludo inicial del personaje).
 *
 * @param {{ role: string, text: string }[]} history
 * @returns {{ role: "user" | "model", parts: { text: string }[] }[]}
 */
export function buildContents(history) {
  if (!Array.isArray(history)) return [];

  const firstUser = history.findIndex((m) => m.role === "user");
  if (firstUser === -1) return [];

  return history.slice(firstUser).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));
}

/**
 * Saca el texto de la respuesta de Gemini.
 * Si la respuesta viene vacía o con otra forma, devuelve "".
 *
 * @param {object} data - JSON devuelto por generateContent
 * @returns {string}
 */
export function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";

  return parts
    .map((p) => p?.text || "")
    .join("")
    .trim();
}
