"use client";

import { useEffect } from "react";

type MediaSessionOptions = {
  title: string;
  artist?: string;
  artwork?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
};

/**
 * Surfaces lock-screen / notification-shade media controls via the Media
 * Session API. This is what makes background playback feel "real" instead
 * of just "the tab happens to keep playing" — note iOS Safari/PWA still
 * imposes its own background-audio limits regardless of this API.
 */
export function useMediaSession({
  title,
  artist = "Pilu Sleep Sounds",
  artwork,
  isPlaying,
  onPlay,
  onPause,
  onStop,
}: MediaSessionOptions) {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: artwork ? [{ src: artwork, sizes: "512x512", type: "image/png" }] : [],
    });

    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    navigator.mediaSession.setActionHandler("stop", onStop);
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("stop", null);
    };
  }, [title, artist, artwork, isPlaying, onPlay, onPause, onStop]);
}
