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
      "Siento que se sienta así. Gracias por contármelo.",
      "Está bien no estar bien. Ya quedó anotado, y si quiere, cuéntele también a alguien cercano.",
    ],
  },
  {
    palabras: ["dolor", "duele", "molestia", "mareo", "cansad", "enferm"],
    respuestas: ["Anoto que no se siente del todo bien. Si el malestar sigue, coméntele a su médico."],
  },
  {
    palabras: ["bien", "feliz", "content", "alegre", "tranquil", "mejor"],
    respuestas: ["Qué bueno escuchar eso. Me alegra que esté bien hoy.", "Me alegra mucho. Sigamos así."],
  },
  {
    palabras: ["gracias"],
    respuestas: ["Con gusto. Aquí estoy cuando me necesite."],
  },
];

const RESPUESTA_GENERICA = ["Gracias por contarme. Ya quedó guardado.", "Lo escuché. Gracias por compartirlo conmigo."];

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
