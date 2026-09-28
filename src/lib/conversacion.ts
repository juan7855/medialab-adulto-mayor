/**
 * Respuestas del asistente por palabras clave.
 *
 * No es un modelo de IA ni requiere backend: es una lista de reglas que se
 * puede ampliar a mano según lo que digan los pacientes en la práctica. Así
 * se "entrena" la conversación, editando este archivo, sin costo.
 */

interface Regla {
  palabras: string[];
  respuestas: string[];
}

const REGLAS: Regla[] = [
  {
    palabras: ["triste", "mal", "solo", "sola", "deprimid", "llorando", "llorar", "angustia"],
    respuestas: [
      "Siento que te sientas así. Gracias por contármelo.",
      "Está bien no estar bien. Ya quedó anotado, y si quieres, cuéntaselo también a alguien cercano.",
    ],
  },
  {
    palabras: ["dolor", "duele", "molestia", "mareo", "cansad", "enferm"],
    respuestas: ["Anoto que no te sientes del todo bien. Si el malestar sigue, coméntaselo a tu médico."],
  },
  {
    palabras: ["bien", "feliz", "content", "alegre", "tranquil", "mejor"],
    respuestas: ["Qué bueno escuchar eso. Me alegra que estés bien hoy.", "Me alegra mucho. Sigamos así."],
  },
  {
    palabras: ["gracias"],
    respuestas: ["Con gusto. Aquí estoy cuando me necesites."],
  },
];

const RESPUESTA_GENERICA = ["Gracias por contarme. Ya quedó guardado.", "Te escuché. Gracias por compartirlo conmigo."];

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function elegir<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

export function responderA(texto: string): string {
  const t = normalizar(texto);
  const regla = REGLAS.find((r) => r.palabras.some((p) => t.includes(normalizar(p))));
  return elegir(regla ? regla.respuestas : RESPUESTA_GENERICA);
}
