"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { ChatUrgency } from "@/types/chat";
import { AlertTriangle, Stethoscope } from "lucide-react";

export function UrgencyCard({ urgency }: { urgency: ChatUrgency }) {
  const { t } = useLocale();
  const dict = t((d) => d.chat.urgency);
  if (urgency === "normal") return null;
  const urgent = urgency === "urgent";
  const Icon = urgent ? AlertTriangle : Stethoscope;
  return <div className={`urgency-card urgency-card--${urgency}`} role={urgent ? "alert" : "status"}><Icon size={19} aria-hidden="true" /><div><strong>{urgent ? dict.urgentTitle : dict.moderateTitle}</strong><span>{urgent ? dict.urgentBody : dict.moderateBody}</span></div></div>;
}
