"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Heart } from "lucide-react";

export function FavoriteButton({ isFavorite, onToggle, label }: { isFavorite: boolean; onToggle: () => void; label: string }) {
  const { t } = useLocale();
  const sd = t((d) => d.sleepSounds);
  return (
    <button
      type="button"
      className="favorite-toggle"
      aria-pressed={isFavorite}
      aria-label={(isFavorite ? sd.favorite.removeAriaTemplate : sd.favorite.addAriaTemplate).replace("{label}", label)}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <Heart size={16} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
