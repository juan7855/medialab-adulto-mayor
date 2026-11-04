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

/**
 * Habla un texto apenas el navegador lo permita.
 *
 * En celulares (Chrome Android, Safari iOS) una página no puede hablar sola:
 * hace falta que la persona haya tocado la pantalla. En el computador suele
 * permitirse. Así que se intenta de inmediato y, si la voz no arranca, se
 * repite dentro del primer toque o tecla — iOS exige que `speak()` ocurra
 * dentro del propio gesto, no después.
 *
 * Devuelve una función para cancelar la espera (al desmontar el componente).
 */
export function hablarCuandoSePueda(texto: string): () => void {
  if (!disponibleVoz() || !texto) return () => {};

  let arranco = false;
  let esperando = false;
  const eventos = ["pointerdown", "touchend", "keydown"] as const;

  const quitar = () => {
    if (!esperando) return;
    esperando = false;
    eventos.forEach((e) => window.removeEventListener(e, alTocar, true));
  };

  function alTocar() {
    quitar();
    if (!arranco) hablarMarcando();
  }

  function hablarMarcando() {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = "es-ES";
      u.rate = 0.95;
      const voz = elegirVoz();
      if (voz) u.voice = voz;
      u.onstart = () => {
        arranco = true;
        quitar();
      };
      window.speechSynthesis.speak(u);
    } catch {
      // Sin voz: la app sigue funcionando igual, en silencio.
    }
  }

  // Si el navegador informa que aún no hubo ningún toque, ni se intenta:
  // se espera directamente al primer gesto.
  const activacion = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
    .userActivation;
  if (!activacion || activacion.hasBeenActive) hablarMarcando();

  esperando = true;
  eventos.forEach((e) => window.addEventListener(e, alTocar, { capture: true, passive: true }));

  return quitar;
}

export function detenerVoz(): void {
  if (!disponibleVoz()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // no-op
  }
}
