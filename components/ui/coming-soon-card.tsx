import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";

export function ComingSoonCard({ title, description, illustration = "teddy" }: { title: string; description: string; illustration?: "teddy" | "bath-duck" }) {
  return (
    <section className="coming-soon-card">
      <div className="coming-soon-card__icon" aria-hidden="true"><Sparkles size={20} /></div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <PiluIllustration variant={illustration} className="coming-soon-card__illustration" />
    </section>
  );
}
