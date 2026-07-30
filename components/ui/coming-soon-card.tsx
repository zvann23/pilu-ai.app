import { Sparkles } from "lucide-react";

export function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <section className="coming-soon-card">
      <div className="coming-soon-card__icon" aria-hidden="true"><Sparkles size={20} /></div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
