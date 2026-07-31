import { PiluLogo } from "@/components/branding/logo";
import type { ReactNode } from "react";

export function AuthShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="auth-shell">
      <PiluLogo size="medium" priority />
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <span>{subtitle}</span>
      <div className="auth-shell__card">{children}</div>
    </div>
  );
}
