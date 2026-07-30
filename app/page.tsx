import { Logo } from "@/components/branding/logo";
import { PwaRegistration } from "@/components/ui/pwa-registration";
import { Heart, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="welcome-shell">
      <PwaRegistration />
      <div className="welcome-glow welcome-glow--pink" aria-hidden="true" />
      <div className="welcome-glow welcome-glow--yellow" aria-hidden="true" />

      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="welcome-mark" aria-hidden="true">
          <Heart size={21} strokeWidth={1.8} />
        </div>
        <Logo className="welcome-logo" />
        <Sparkles className="welcome-sparkle" size={20} strokeWidth={1.6} aria-hidden="true" />
        <h1 id="welcome-title">Your baby&apos;s AI companion</h1>
        <div className="welcome-loader" aria-label="Preparing Pilu">
          <span />
          <span />
          <span />
        </div>
        <p>Helping parents through every little moment.</p>
      </section>
    </main>
  );
}
