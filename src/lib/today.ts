"use client";

import { useSyncExternalStore } from "react";

/**
 * Fecha local del usuario en formato YYYY-MM-DD.
 *
 * Ojo: `new Date().toISOString()` da la fecha en UTC, que en husos negativos
 * (América) adelanta el día durante la tarde-noche. Aquí se usan los getters
 * locales para que "hoy" sea el hoy del usuario.
 */
export function todayISO(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** El reloj no emite eventos: nos basta con leerlo una vez al hidratar. */
const noSubscribe = () => () => {};

/**
 * "Hoy" resuelto en el navegador. Devuelve null durante el render del servidor.
 *
 * Las páginas se prerenderizan estáticamente, así que calcular la fecha en el
 * servidor la congelaría en el momento del build: la app mostraría siempre el
 * día en que se desplegó. Además el servidor corre en UTC y no conoce el huso
 * horario del usuario.
 *
 * Se usa useSyncExternalStore en vez de useEffect + setState porque es
 * justamente el hook previsto para leer un valor que sólo existe en el
 * cliente, y evita el render en cascada.
 */
export function useToday(): string | null {
  return useSyncExternalStore(
    noSubscribe,
    () => todayISO(),
    () => null,
  );
}

/** true sólo una vez que el componente vive en el navegador. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}
