"use client";

/**
 * Voz hablada de la app: texto a voz con la Web Speech API del navegador.
 * Gratis y sin backend — el soporte varía por navegador (bien en
 * Chrome/Edge; limitado en Safari/iOS), así que todo aquí falla en
 * silencio si la API no existe.
 */

export function disponibleVoz(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function elegirVoz(genero?: "masculina" | "femenina"): SpeechSynthesisVoice | null {
  const voces = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("es"));
  if (voces.length === 0) return null;
  if (!genero) return voces[0];
  // Las voces del sistema no siempre exponen el género como dato, así que se
  // busca por nombres típicos antes de resignarse a la primera disponible.
  const pistas =
    genero === "femenina"
      ? ["mujer", "female", "mónica", "monica", "paulina", "lucia", "elena", "helena"]
      : ["hombre", "male", "jorge", "diego", "carlos", "pablo", "juan"];
  const porNombre = voces.find((v) => pistas.some((p) => v.name.toLowerCase().includes(p)));
  return porNombre ?? voces[0];
}

/**
 * Habla un texto. Cancela lo que estuviera diciendo antes, para que no se
 * amontonen frases si la persona navega rápido entre pantallas.
 */
export function hablar(texto: string, genero?: "masculina" | "femenina"): void {
  if (!disponibleVoz() || !texto) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "es-ES";
    u.rate = 0.95;
    const voz = elegirVoz(genero);
    if (voz) u.voice = voz;
    window.speechSynthesis.speak(u);
  } catch {
    // Sin voz: la app sigue funcionando igual, en silencio.
  }
}

export function detenerVoz(): void {
  if (!disponibleVoz()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // no-op
  }
}
