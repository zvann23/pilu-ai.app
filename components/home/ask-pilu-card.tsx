import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function AskPiluCard() {
  return (
    <section className="ask-pilu-card">
      <div className="ask-pilu-card__icon" aria-hidden="true"><MessageCircle size={21} /></div>
      <div className="ask-pilu-card__copy">
        <h2>Ask Pilu</h2>
        <p>Questions about feeding, sleep, crying or your baby&apos;s development?</p>
      </div>
      <Link className="ask-pilu-card__button" href="/ask-pilu">Talk to Pilu</Link>
    </section>
  );
}
