import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NOMBRE_COOKIE_SESION, verificarCookieSesion } from "@/lib/auth-firma";

/**
 * Antes de este archivo, ninguna página comprobaba la sesión: `haySesion()`
 * existía en src/lib/sesion.ts pero nadie la llamaba, así que escribir
 * /inicio directo en el navegador entraba sin pasar por la clave. Esto
 * corre antes de renderizar cualquier página protegida y redirige a "/" si
 * no hay una cookie de sesión válida.
 *
 * Middleware corre en el runtime Edge, no en Node: por eso la verificación
 * vive en auth-firma.ts (usa Web Crypto, no node:crypto).
 */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(NOMBRE_COOKIE_SESION)?.value;
  const patientId = await verificarCookieSesion(cookie);

  if (patientId === null) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Todo excepto: rutas de API (cada una valida su propia sesión y necesita
  // el id del paciente, no sólo un sí/no), los internos de Next, y
  // cualquier archivo estático (algo con extensión: iconos, imágenes,
  // manifest.json...). Enumerar carpetas de public/ una por una es frágil:
  // cualquier archivo nuevo ahí se bloquearía por omisión.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
