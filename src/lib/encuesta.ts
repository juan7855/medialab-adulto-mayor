/**
 * Encuesta de bienestar obligatoria. Las preguntas son las que exige el
 * programa, con su redacción original; no se reformulan.
 */
export const PREGUNTAS = [
  { clave: "lifeSatisfaction", texto: "¿Qué tan satisfecho se siente con lo que ha hecho en la vida hasta ahora?" },
  { clave: "dailyWorthwhile", texto: "¿Qué tan importantes son las cosas que hace a diario?" },
  { clave: "happyYesterday", texto: "¿Qué tan feliz estuvo ayer?" },
  { clave: "anxiousYesterday", texto: "¿Qué tan preocupado o ansioso estuvo ayer?" },
  { clave: "sadYesterday", texto: "¿Qué tan triste o deprimido estuvo ayer?" },
] as const;

export type ClavePregunta = (typeof PREGUNTAS)[number]["clave"];

export interface RespuestaEncuesta {
  scores: Record<ClavePregunta, number>;
}

/** Pantalla siguiente a la encuesta: dos preguntas, ninguna obligatoria. */
export const OPCIONES_SUENO = ["Muy bien", "Bien", "Regular", "Mal"] as const;
export type OpcionSueno = (typeof OPCIONES_SUENO)[number];
export const LARGO_MAXIMO_NOTA = 500;

export interface RespuestaConversemos {
  extraNote?: string;
  sleepQuality?: OpcionSueno | null;
}
