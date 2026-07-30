import type { ChatUrgency } from "@/types/chat";
import { AlertTriangle, Stethoscope } from "lucide-react";

export function UrgencyCard({ urgency }: { urgency: ChatUrgency }) { if (urgency === "normal") return null; const urgent = urgency === "urgent"; const Icon = urgent ? AlertTriangle : Stethoscope; return <div className={`urgency-card urgency-card--${urgency}`} role={urgent ? "alert" : "status"}><Icon size={19} aria-hidden="true" /><div><strong>{urgent ? "Get urgent help now" : "Consider contacting your pediatrician"}</strong><span>{urgent ? "Contact your local emergency services immediately." : "A pediatrician can help you decide what to do next."}</span></div></div>; }
