/** Base tipográfica del sistema, en px (ver `html` en globals.css). */
const BASE = 22;

/**
 * Convierte un tamaño pensado en px a rem.
 *
 * Los componentes siguen recibiendo números legibles (58, 62, 74), pero se
 * pintan en rem para que escalen junto al resto del sistema cuando la base
 * baja en pantallas estrechas. Si se dejan en px, los iconos se quedan
 * grandes mientras el texto encoge y acaban asfixiando la columna de texto.
 */
export function rem(px: number): string {
  return `${(px / BASE).toFixed(4).replace(/\.?0+$/, "")}rem`;
}
