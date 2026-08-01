"use client";
/* eslint-disable @next/next/no-img-element -- local blob previews are deliberately not uploaded. */

import { useLocale } from "@/components/i18n/locale-provider";
import { useMemories } from "@/components/memory/memory-provider";
import { formatMemoryDate } from "@/lib/memory-data";
import { Heart, Images } from "lucide-react";
import Link from "next/link";

export function RecentMemoryHomeCard() {
  const { memories } = useMemories();
  const { t } = useLocale();
  const dict = t((d) => d.home.recentMemoryCard);
  const memory = memories[0];
  if (!memory) return null;
  return <section className="recent-memory-home-card" aria-labelledby="recent-memory-title"><div className="recent-memory-home-card__image">{memory.imagePreview ? <img src={memory.imagePreview} alt={memory.imageAlt || memory.title} /> : <Images size={25} aria-hidden="true" />}</div><div><p>{dict.label}</p><h2 id="recent-memory-title">{memory.title}</h2><span>{formatMemoryDate(memory.date)}</span>{memory.favorite ? <small><Heart size={13} fill="currentColor" aria-hidden="true" />{dict.favorite}</small> : null}<Link href="/memory-book">{dict.button}</Link></div></section>;
}
