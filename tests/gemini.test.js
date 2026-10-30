import { describe, it, expect } from "vitest";
import { buildContents, extractText } from "../lib/gemini.js";

describe("buildContents", () => {
  it("convierte el historial al formato de Gemini", () => {
    const history = [
      { role: "user", text: "Hola Leon" },
      { role: "model", text: "Hola. ¿Qué necesitás?" },
      { role: "user", text: "¿Dónde está Ashley?" },
    ];

    expect(buildContents(history)).toEqual([
      { role: "user", parts: [{ text: "Hola Leon" }] },
      { role: "model", parts: [{ text: "Hola. ¿Qué necesitás?" }] },
      { role: "user", parts: [{ text: "¿Dónde está Ashley?" }] },
    ]);
  });

  it("descarta el saludo del personaje porque Gemini exige empezar con el usuario", () => {
    const history = [
      { role: "model", text: "Leon S. Kennedy, agente especial." },
      { role: "user", text: "Hola" },
    ];

    const contents = buildContents(history);

    expect(contents).toHaveLength(1);
    expect(contents[0].role).toBe("user");
  });

  it("devuelve un array vacío si no hay mensajes del usuario o el historial no es válido", () => {
    expect(buildContents([{ role: "model", text: "Saludo" }])).toEqual([]);
    expect(buildContents([])).toEqual([]);
    expect(buildContents(undefined)).toEqual([]);
  });
});

describe("extractText", () => {
  it("devuelve el texto de la respuesta de Gemini", () => {
    const data = {
      candidates: [{ content: { parts: [{ text: "Quedate cerca. " }, { text: "Esto se pone feo." }] } }],
    };

    expect(extractText(data)).toBe("Quedate cerca. Esto se pone feo.");
  });

  it("saca los espacios sobrantes del principio y el final", () => {
    const data = { candidates: [{ content: { parts: [{ text: "  Grrr...  \n" }] } }] };

    expect(extractText(data)).toBe("Grrr...");
  });

  it("devuelve un string vacío si la respuesta no trae texto", () => {
    expect(extractText({})).toBe("");
    expect(extractText({ candidates: [] })).toBe("");
    expect(extractText(null)).toBe("");
  });
});
