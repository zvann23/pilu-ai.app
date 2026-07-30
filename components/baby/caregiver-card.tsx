import type { Caregiver } from "@/types/baby";
import { Phone, ShieldCheck } from "lucide-react";

export function CaregiverCard({ caregiver }: { caregiver: Caregiver }) {
  return <article className="caregiver-card"><div className="caregiver-card__avatar">{caregiver.name.slice(0, 1)}</div><div><h3>{caregiver.name}</h3><p>{caregiver.relationship}</p><span><Phone size={13} aria-hidden="true" />{caregiver.phone}</span><small><ShieldCheck size={13} aria-hidden="true" />{caregiver.permission}</small></div></article>;
}
