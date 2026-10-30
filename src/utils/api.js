// Envía el personaje y el historial a nuestra función serverless
export async function sendMessage(character, history) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ character, history }),
  });

  // Intentamos leer el JSON aunque la respuesta sea de error,
  // para mostrar el mensaje que manda el servidor
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  if (!data.reply) throw new Error("La respuesta no trajo texto");

  return data.reply;
}
