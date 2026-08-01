"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function AskPiluCard() {
  const { t } = useLocale();
  const dict = t((d) => d.home.askPiluCard);
  return (
    <section className="ask-pilu-card">
      <div className="ask-pilu-card__icon" aria-hidden="true"><MessageCircle size={21} /></div>
      <div className="ask-pilu-card__copy">
        <h2>{dict.heading}</h2>
        <p>{dict.description}</p>
      </div>
      <Link className="ask-pilu-card__button" href="/ask-pilu">{dict.button}</Link>
    </section>
  );
}
