import type { FotoDePost as Foto } from "@/lib/comunidad";

/**
 * La foto de un post.
 *
 * En el feed se recorta a un alto cómodo: una foto muy vertical ocuparía la
 * pantalla entera y haría creer que ahí se acaba el foro. En la pantalla del
 * post se ve completa, que es a lo que se entra.
 *
 * El hueco se reserva con la forma real de la foto (ancho y alto guardados al
 * publicar), así nada salta de sitio mientras carga — importa con una mano
 * que ya está yendo a tocar un botón.
 */
export default function FotoDePost({
  postId,
  foto,
  modo,
}: {
  postId: number;
  foto: Foto;
  modo: "feed" | "detalle";
}) {
  const proporcion = foto.width / foto.height;
  // 0.8 ≈ 4:5, el retrato más alto que se deja pasar en el feed.
  const proporcionCaja = modo === "feed" ? Math.max(proporcion, 0.8) : proporcion;

  return (
    <div
      className="mt-2.5 overflow-hidden"
      style={{
        aspectRatio: String(proporcionCaja),
        backgroundColor: "var(--surface-soft)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-md)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- la ruta ya sirve una imagen reducida y cacheada tras la sesión; next/image no puede optimizar una ruta privada. */}
      <img
        src={`/api/comunidad/posts/${postId}/imagen`}
        alt="Foto de la publicación"
        width={foto.width}
        height={foto.height}
        loading={modo === "feed" ? "lazy" : "eager"}
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
