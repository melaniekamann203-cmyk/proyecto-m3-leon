// Envía el personaje y el historial a nuestra función serverless
export async function sendMessage(character, history) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ character, history }),
  });

  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.reply;
}
