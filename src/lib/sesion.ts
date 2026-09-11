"use client";

const CLAVE = "misalud.animal";

/**
 * Quién entró, guardado en el navegador.
 *
 * Esto NO es autenticación: hoy cualquier animal abre la app. Sólo sirve para
 * recordar cuál se eligió y poder mostrarlo. Cuando haya usuarios de verdad,
 * esta pieza se sustituye por una sesión en el servidor.
 */
export function guardarAnimal(id: string): void {
  try {
    window.localStorage.setItem(CLAVE, id);
  } catch {
    // Modo privado o almacenamiento bloqueado: se entra igual, sin recordar.
  }
}

export function leerAnimal(): string | null {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export function olvidarAnimal(): void {
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    // nada que hacer
  }
}
