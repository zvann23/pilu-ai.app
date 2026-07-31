"use client";

import { useCallback, useEffect, useRef } from "react";

type PlayOptions = {
  src: string;
  /** Target volume, 0..1 */
  volume: number;
  fadeInSeconds?: number;
};

/**
 * Thin wrapper around an <audio> element routed through the Web Audio API,
 * so volume changes and fade in/out are sample-accurate ramps (GainNode)
 * rather than jumps on el.volume. Streaming through <audio> (instead of
 * decoding a full AudioBuffer) keeps memory flat for long ambient loops.
 */
export function useAudioEngine() {
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const currentSrcRef = useRef<string | null>(null);

  const ensureGraph = useCallback((src: string) => {
    if (!audioElRef.current) {
      const el = new Audio();
      el.loop = true;
      el.preload = "auto";
      audioElRef.current = el;
    }

    if (!audioCtxRef.current) {
      const AudioContextCtor =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextCtor();
    }

    const el = audioElRef.current;
    const audioCtx = audioCtxRef.current;

    if (currentSrcRef.current !== src) {
      el.src = src;
      currentSrcRef.current = src;
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioCtx.createMediaElementSource(el);
      gainNodeRef.current = audioCtx.createGain();
      sourceNodeRef.current.connect(gainNodeRef.current).connect(audioCtx.destination);
    }

    return { el, audioCtx, gain: gainNodeRef.current as GainNode };
  }, []);

  const play = useCallback(
    async ({ src, volume, fadeInSeconds = 2 }: PlayOptions) => {
      const { el, audioCtx, gain } = ensureGraph(src);

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + fadeInSeconds);

      await el.play();
    },
    [ensureGraph],
  );

  /** Ramps volume smoothly — safe to call continuously from a slider. */
  const setVolume = useCallback((volume: number, rampSeconds = 0.15) => {
    const audioCtx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    if (!audioCtx || !gain) return;

    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(volume, now + rampSeconds);
  }, []);

  const pause = useCallback(() => {
    audioElRef.current?.pause();
  }, []);

  /** Fades to silence, then pauses. Resolves once the fade has completed. */
  const stop = useCallback((fadeOutSeconds = 2) => {
    const audioCtx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    const el = audioElRef.current;

    if (!audioCtx || !gain || !el) return Promise.resolve();

    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + fadeOutSeconds);

    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        el.pause();
        resolve();
      }, fadeOutSeconds * 1000);
    });
  }, []);

  useEffect(() => {
    return () => {
      audioElRef.current?.pause();
      audioCtxRef.current?.close().catch(() => undefined);
    };
  }, []);

  return { play, pause, stop, setVolume };
}
