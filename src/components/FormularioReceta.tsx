"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";
import { rem } from "@/lib/scale";

const DIFICULTADES = ["Muy fácil", "Fácil", "Moderada"] as const;

const campoStyle = {
  padding: "0.85rem 1rem",
  fontSize: "var(--t-md)",
  fontWeight: 500,
  fontFamily: "inherit",
  color: "var(--ink)",
} as const;

/** Receta que el propio paciente agrega: ingredientes y pasos van "uno por
 *  línea" en un textarea en vez de filas que agregar y quitar — más fácil
 *  de escribir para una persona mayor que una lista dinámica de campos. */
export default function FormularioReceta() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [porciones, setPorciones] = useState("");
  const [dificultad, setDificultad] = useState<(typeof DIFICULTADES)[number]>("Fácil");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [consejo, setConsejo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo =
    nombre.trim().length > 0 &&
    ingredientes.trim().length > 0 &&
    pasos.trim().length > 0 &&
    !guardando;

  const guardar = async () => {
    if (!listo) return;
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch("/api/nutricion/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          time: tiempo,
          servings: porciones,
          difficulty: dificultad,
          ingredients: ingredientes,
          steps: pasos,
          tip: consejo,
        }),
      });
      const data = (await res.json()) as { id?: number; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "error");
      router.push(`/nutricion/receta/${data.id}`);
    } catch {
      setError("No se pudo guardar. Revise que haya ingredientes y pasos, e intente de nuevo.");
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="r-nombre" className="block mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
          Nombre de la receta
        </label>
        <input
          id="r-nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={80}
          placeholder="Por ejemplo: Caldo de pollo"
          className="card w-full"
          style={campoStyle}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="r-tiempo" className="block mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
            Tiempo
          </label>
          <input
            id="r-tiempo"
            type="text"
            value={tiempo}
            onChange={(e) => setTiempo(e.target.value)}
            maxLength={40}
            placeholder="20 min"
            className="card w-full"
            style={campoStyle}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="r-porciones" className="block mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
            Porciones
          </label>
          <input
            id="r-porciones"
            type="text"
            value={porciones}
            onChange={(e) => setPorciones(e.target.value)}
            maxLength={40}
            placeholder="2 porciones"
            className="card w-full"
            style={campoStyle}
          />
        </div>
      </div>

      <fieldset className="m-0 p-0" style={{ border: 0 }}>
        <legend className="mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
          Qué tan difícil es
        </legend>
        <div className="flex gap-2">
          {DIFICULTADES.map((d) => {
            const activo = dificultad === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDificultad(d)}
                className="flex-1 pressable"
                style={{
                  minHeight: "var(--touch)",
                  borderRadius: "var(--r-pill)",
                  fontSize: "var(--t-sm)",
                  fontWeight: 600,
                  backgroundColor: activo ? "var(--cta-dark)" : "var(--surface)",
                  color: activo ? "#fff" : "var(--ink)",
                  border: `var(--border-w) solid ${activo ? "var(--cta-dark)" : "var(--line)"}`,
                }}
                aria-pressed={activo}
              >
                {d}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="r-ingredientes" className="block mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
          Ingredientes (uno por línea)
        </label>
        <textarea
          id="r-ingredientes"
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
          rows={5}
          placeholder={"2 papas\n1 cebolla\nSal al gusto"}
          className="card w-full"
          style={{ ...campoStyle, resize: "none", minHeight: rem(130) }}
        />
      </div>

      <div>
        <label htmlFor="r-pasos" className="block mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
          Preparación (un paso por línea)
        </label>
        <textarea
          id="r-pasos"
          value={pasos}
          onChange={(e) => setPasos(e.target.value)}
          rows={5}
          placeholder={"Pele y corte las papas\nCocine 20 minutos\nSirva caliente"}
          className="card w-full"
          style={{ ...campoStyle, resize: "none", minHeight: rem(130) }}
        />
      </div>

      <div>
        <label htmlFor="r-consejo" className="block mb-1.5" style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
          Un consejo (opcional)
        </label>
        <textarea
          id="r-consejo"
          value={consejo}
          onChange={(e) => setConsejo(e.target.value)}
          rows={2}
          maxLength={200}
          placeholder="Por ejemplo: se puede congelar hasta 3 días"
          className="card w-full"
          style={{ ...campoStyle, resize: "none" }}
        />
      </div>

      {error && (
        <p role="alert" style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--red-solid)" }}>
          {error}
        </p>
      )}

      <button
        onClick={() => void guardar()}
        disabled={!listo}
        className="btn-cta pressable w-full"
        style={{ minHeight: rem(84), fontSize: "var(--t-lg)", opacity: listo ? 1 : 0.5 }}
      >
        <ChefHat size={24} strokeWidth={2.3} aria-hidden="true" />
        {guardando ? "Guardando..." : "Guardar receta"}
      </button>
    </div>
  );
}
