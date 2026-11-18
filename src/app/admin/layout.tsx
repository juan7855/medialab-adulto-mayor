import type { ReactNode } from "react";

/**
 * Las páginas de /admin son herramientas del facilitador (fichas para
 * imprimir, guion), no parte de la app para el adulto mayor. El body de la
 * app está limitado a 480px (ver globals.css, patrón mobile-first) — en una
 * laptop, con ese ancho estas páginas quedan apretadas en el centro.
 *
 * Este <style> levanta ese tope sólo mientras se visita /admin/*. No
 * necesita ser un componente cliente: es CSS estático que Next.js inyecta
 * en el <head> y queda activo mientras esta rama del árbol está montada.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`body { max-width: none; }`}</style>
      {children}
    </>
  );
}
