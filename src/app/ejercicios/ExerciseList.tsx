"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import IconTile from "@/components/IconTile";
import { EXERCISES, LEVELS, LEVEL_ACCENT, type Level } from "./data";

export default function ExerciseList() {
  const [level, setLevel] = useState<Level>("Ligero");

  const visible = EXERCISES.filter((ex) => ex.level === level);

  return (
    <>
      {/* Filtro por intensidad */}
      <div className="flex gap-2.5" role="tablist" aria-label="Filtrar por intensidad">
        {LEVELS.map((option) => {
          const active = option === level;

          return (
            <button
              key={option}
              role="tab"
              aria-selected={active}
              onClick={() => setLevel(option)}
              className="flex-1 pressable"
              style={{
                minHeight: "3.3rem",
                borderRadius: "var(--r-md)",
                fontSize: "var(--t-sm)",
                fontWeight: 800,
                backgroundColor: active ? "var(--cta)" : "var(--surface)",
                color: active ? "#fff" : "var(--ink-soft)",
                border: `1px solid ${active ? "var(--cta)" : "var(--line-strong)"}`,
                boxShadow: active ? "var(--shadow)" : "var(--shadow-sm)",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      <ul
        className="flex flex-col gap-3 mt-4 list-none p-0 m-0"
        aria-label={`Ejercicios de intensidad ${level}`}
      >
        {visible.map((ex, i) => (
          <li key={ex.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
            <Link
              href={`/ejercicios/${ex.id}`}
              className="card pressable flex items-center gap-3.5 p-3.5"
              style={{ textDecoration: "none", color: "inherit" }}
              aria-label={`${ex.name}. ${ex.description}. Duración ${ex.duration}`}
            >
              <IconTile icon={ex.icon} accent={LEVEL_ACCENT[ex.level]} size={66} strokeWidth={1.9} />

              <span className="flex-1 min-w-0">
                <span
                  className="block"
                  style={{ fontSize: "var(--t-md)", fontWeight: 800, lineHeight: 1.2 }}
                >
                  {ex.name}
                </span>
                <span
                  className="block mt-1"
                  style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
                >
                  {ex.description}
                </span>
                <span className="pill mt-2">
                  <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
                  {ex.duration}
                </span>
              </span>

              <ChevronRight size={26} strokeWidth={2.3} color="var(--ink-mute)" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
