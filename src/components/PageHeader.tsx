import BackButton from "./BackButton";

interface PageHeaderProps {
  title: string;
  emoji: string;
  color: string;
  backHref?: string;
  backLabel?: string;
}

export default function PageHeader({
  title,
  emoji,
  color,
  backHref = "/",
  backLabel = "Inicio",
}: PageHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 w-full shadow-md"
      style={{ backgroundColor: color }}
      role="banner"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <BackButton href={backHref} label={backLabel} />
        <div className="flex items-center gap-2 ml-2">
          <span style={{ fontSize: "1.8rem" }} aria-hidden="true">{emoji}</span>
          <h1
            className="font-extrabold text-white"
            style={{ fontSize: "1.5rem", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
