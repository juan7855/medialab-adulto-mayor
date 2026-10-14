"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  PREGUNTAS,
  TIPOS_DOCUMENTO,
  type ClavePregunta,
} from "@/lib/encuesta";

const CAMPO: React.CSSProperties = {
  width: "100%",
  minHeight: "3.4rem",
  padding: "0.6rem 1rem",
  fontFamily: "inherit",
  fontSize: "var(--t-base)",
  fontWeight: 600,
  color: "var(--ink)",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--line-strong)",
  borderRadius: "var(--r-md)",
};

function Tarjeta({
  id,
  etiqueta,
  children,
}: {
  id: string;
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4">
      <label
        htmlFor={id}
        className="block mb-3"
        style={{ fontSize: "var(--t-base)", fontWeight: 800, lineHeight: 1.25 }}
      >
        {etiqueta} <span style={{ color: "var(--red-solid)" }} aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  );
}

/** Escala 0–10 en botones grandes: once círculos en una fila no se pueden tocar bien. */
function Escala({
  clave,
  texto,
  valor,
  onChange,
}: {
  clave: string;
  texto: string;
  valor: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset className="card p-4 m-0" style={{ minWidth: 0 }}>
      <legend
        className="p-0 mb-3"
        style={{ fontSize: "var(--t-base)", fontWeight: 800, lineHeight: 1.25, float: "left", width: "100%" }}
      >
        {texto} <span style={{ color: "var(--red-solid)" }} aria-hidden="true">*</span>
      </legend>

      <div className="grid grid-cols-6 gap-2" style={{ clear: "both" }}>
        {Array.from({ length: 11 }, (_, n) => {
          const activo = valor === n;
          return (
            <label
              key={n}
              className="flex items-center justify-center pressable"
              style={{
                minHeight: "3rem",
                borderRadius: "var(--r-pill)",
                fontSize: "var(--t-base)",
                fontWeight: 800,
                cursor: "pointer",
                backgroundColor: activo ? "var(--cta)" : "var(--surface-soft)",
                color: activo ? "#fff" : "var(--ink)",
                border: `1px solid ${activo ? "var(--cta)" : "var(--line-strong)"}`,
              }}
            >
              <input
                type="radio"
                name={clave}
                value={n}
                checked={activo}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              {n}
            </label>
          );
        })}
      </div>

      <div
        className="flex justify-between mt-2"
        style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}
        aria-hidden="true"
      >
        <span>0 = nada</span>
        <span>10 = completamente</span>
      </div>
    </fieldset>
  );
}

export default function FormularioEncuesta({ nombreInicial }: { nombreInicial: string }) {
  const router = useRouter();
  const [tipo, setTipo] = useState("");
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState(nombreInicial);
  const [puntajes, setPuntajes] = useState<Partial<Record<ClavePregunta, number>>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completa =
    tipo !== "" &&
    numero.trim() !== "" &&
    nombre.trim() !== "" &&
    PREGUNTAS.every((p) => puntajes[p.clave] !== undefined);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completa || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: tipo,
          documentNumber: numero,
          fullName: nombre,
          scores: puntajes,
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/animo");
    } catch {
      setError("No se pudo guardar. Intente de nuevo.");
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={(e) => void enviar(e)} className="flex flex-col gap-3.5" noValidate>
      <Tarjeta id="tipo-documento" etiqueta="Tipo de documento">
        <div className="relative">
          <select
            id="tipo-documento"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            style={{
              ...CAMPO,
              appearance: "none",
              paddingRight: "2.8rem",
              color: tipo ? "var(--ink)" : "var(--ink-mute)",
            }}
          >
            <option value="" disabled>
              Elegir
            </option>
            {TIPOS_DOCUMENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            size={22}
            strokeWidth={2.4}
            aria-hidden="true"
            style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
        </div>
      </Tarjeta>

      <Tarjeta id="numero-documento" etiqueta="Número de documento">
        <input
          id="numero-documento"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={30}
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Su respuesta"
          required
          style={CAMPO}
        />
      </Tarjeta>

      <Tarjeta id="nombre-completo" etiqueta="Nombre completo">
        <input
          id="nombre-completo"
          type="text"
          autoComplete="name"
          maxLength={120}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Su respuesta"
          required
          style={CAMPO}
        />
      </Tarjeta>

      {PREGUNTAS.map((p) => (
        <Escala
          key={p.clave}
          clave={p.clave}
          texto={p.texto}
          valor={puntajes[p.clave] ?? null}
          onChange={(n) => setPuntajes((prev) => ({ ...prev, [p.clave]: n }))}
        />
      ))}

      {error && (
        <p role="alert" style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--red-solid)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!completa || enviando}
        className="btn-cta pressable w-full mt-2"
        style={{ opacity: completa && !enviando ? 1 : 0.5, fontSize: "var(--t-base)" }}
      >
        {enviando ? "Guardando…" : "Enviar y continuar"}
      </button>

      {!completa && (
        <p
          className="text-center"
          style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}
        >
          Responda todas las preguntas para continuar
        </p>
      )}
    </form>
  );
}
