"use client";

import { useCare } from "@/components/care/care-provider";
import { CalendarHeart, Pill } from "lucide-react";
import Link from "next/link";

export function CareItemHomeCard() {
  const { schedule, medicines, vaccines } = useCare();
  const dose = [...schedule].sort((a, b) => a.time.localeCompare(b.time)).find((item) => item.status === "upcoming");
  const medicine = medicines.find((item) => item.id === dose?.medicineId);
  const vaccine = vaccines.find((item) => item.status === "upcoming");
  const isMedicine = Boolean(dose && medicine);
  const title = isMedicine ? `${medicine?.name} scheduled at ${dose?.time}` : vaccine ? `Vaccine appointment on ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(new Date(`${vaccine.plannedDate}T12:00:00`))}` : "No care item scheduled";
  return <section className="care-item-home-card"><div><span>{isMedicine ? <Pill size={18} /> : <CalendarHeart size={18} />}</span><p>Next care item</p></div><h2>{title}</h2><small>Parent-entered local schedule</small><Link href={isMedicine ? "/medicine" : "/vaccines"}>View details</Link></section>;
}
