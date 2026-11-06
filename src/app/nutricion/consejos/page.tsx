import PageHeader from "@/components/PageHeader";
import { TIPS } from "../contenido";

export default function ConsejosPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Consejos" backHref="/nutricion" backLabel="Nutrición" />
      <main className="px-4 pt-4" role="main">
        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="card p-4"
              style={{ borderRadius: "var(--r-xl)", fontSize: "var(--t-base)", fontWeight: 500 }}
            >
              {tip}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
