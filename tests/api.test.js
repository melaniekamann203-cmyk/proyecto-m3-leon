import { describe, it, expect, vi, afterEach } from "vitest";
import { sendMessage } from "../src/utils/api.js";

// Arma una respuesta falsa de fetch
function mockFetch(ok, status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const history = [{ role: "user", text: "Hola Ada" }];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendMessage", () => {
  it("devuelve la respuesta del personaje cuando todo sale bien", async () => {
    mockFetch(true, 200, { reply: "Vaya, una visita." });

    const reply = await sendMessage("ada", history);

    expect(reply).toBe("Vaya, una visita.");
  });

  it("envía el personaje y el historial a /api/chat por POST", async () => {
    const fetchMock = mockFetch(true, 200, { reply: "Ok" });

    await sendMessage("ada", history);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/chat");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ character: "ada", history });
  });

  it("lanza el error que manda el servidor cuando la respuesta falla", async () => {
    mockFetch(false, 400, { error: "Personaje desconocido" });

    await expect(sendMessage("nemesis", history)).rejects.toThrow("Personaje desconocido");
  });

  it("lanza un error con el código si el servidor no manda mensaje", async () => {
    mockFetch(false, 502, {});

    await expect(sendMessage("leon", history)).rejects.toThrow("Error 502");
  });

  it("lanza un error si falla la red", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Sin conexión")));

    await expect(sendMessage("leon", history)).rejects.toThrow("Sin conexión");
  });
});
