import PageHeader from "@/components/PageHeader";
import WaterTracker from "../WaterTracker";

export default function AguaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="El agua de hoy"
        subtitle="Toque un vaso cada vez que tome uno."
        backHref="/nutricion"
        backLabel="Nutrición"
      />
      <main className="px-4 pt-4" role="main">
        <div className="card p-4" style={{ borderRadius: "var(--r-xl)" }}>
          <WaterTracker />
        </div>
      </main>
    </div>
  );
}
