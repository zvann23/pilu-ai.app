import type { LucideIcon } from "lucide-react";

export function ProfileSectionCard({ title, icon: Icon, tone = "pink", children }: { title: string; icon: LucideIcon; tone?: "pink" | "blue" | "yellow" | "purple"; children: React.ReactNode }) {
  return <section className="profile-section-card"><header><div className={`profile-section-card__icon profile-section-card__icon--${tone}`}><Icon size={19} aria-hidden="true" /></div><h2>{title}</h2></header>{children}</section>;
}

export function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="profile-field"><span>{label}</span><strong>{value || "—"}</strong></div>;
}
