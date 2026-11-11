/**
 * Envío de mensajes a Telegram.
 *
 * Telegram no necesita librería: su API es HTTP plano, así que un fetch
 * basta y el bundle no crece. El bot se crea una vez hablando con
 * @BotFather; el chat de destino se averigua escribiéndole al bot y
 * abriendo https://api.telegram.org/bot<TOKEN>/getUpdates (el chat.id sale
 * ahí; si es un grupo, el id es negativo).
 *
 * Dos reglas que gobiernan este archivo:
 *
 * 1. Nunca romper lo que el paciente estaba haciendo. Si Telegram está
 *    caído, mal configurado o lento, estas funciones devuelven false y la
 *    petición original sigue su curso. Un aviso que no llega es molesto;
 *    una app que no deja llamar al 123 porque un servicio de mensajería
 *    falló es peligroso.
 *
 * 2. Mandar lo mínimo. Esto son datos de salud de personas reales saliendo
 *    hacia un servidor que no es nuestro: nombre de pila y el dato del día,
 *    nunca la ficha clínica, el teléfono ni la dirección.
 */

const API = "https://api.telegram.org";

/** true si hay token y chat configurados. */
export function telegramConfigurado(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/**
 * Escapa lo que Telegram interpretaría como etiqueta en parse_mode HTML.
 * Obligatorio para cualquier texto que venga de la base de datos (nombres,
 * notas del día): si no, un "<" en una nota hace fallar el mensaje entero.
 */
export function escaparHtml(texto: string): string {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Manda un mensaje al chat configurado. Devuelve si salió o no; nunca lanza.
 * El texto admite las etiquetas HTML que soporta Telegram (<b>, <i>, <code>).
 */
export async function enviarTelegram(texto: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[telegram] sin TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID: no se envía nada");
    return false;
  }

  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: texto,
        parse_mode: "HTML",
        // El aviso es el mensaje; que Telegram no intente adivinar enlaces.
        disable_web_page_preview: true,
      }),
      // Una función serverless no puede quedarse esperando a Telegram.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // El cuerpo de error de Telegram dice exactamente qué pasó
      // ("chat not found", "bot was blocked by the user"...). Vale leerlo.
      console.error(`[telegram] ${res.status}: ${await res.text()}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[telegram] no se pudo enviar", error);
    return false;
  }
}

/** La fecha de hoy en Colombia, YYYY-MM-DD. */
export function fechaHoyBogota(): string {
  // en-CA da exactamente YYYY-MM-DD. El servidor corre en UTC, así que sin
  // timeZone el informe de la noche saldría con la fecha del día siguiente.
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/** "martes, 11 de noviembre" — para el encabezado del informe. */
export function fechaEnPalabras(fechaISO: string): string {
  return new Date(`${fechaISO}T12:00:00Z`).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Bogota",
  });
}

/** "7:42 p. m." hora de Colombia — para la hora de una alerta. */
export function horaEnPalabras(fecha: Date = new Date()): string {
  return fecha.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });
}
