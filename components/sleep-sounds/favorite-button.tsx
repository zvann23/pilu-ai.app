"use client";

import { Heart } from "lucide-react";

export function FavoriteButton({ isFavorite, onToggle, label }: { isFavorite: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className="favorite-toggle"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <Heart size={16} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
