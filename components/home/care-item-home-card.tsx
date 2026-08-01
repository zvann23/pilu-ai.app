"use client";

import { useCare } from "@/components/care/care-provider";
import { useLocale, format } from "@/components/i18n/locale-provider";
import { intlLocaleTags } from "@/lib/i18n/locales";
import { CalendarHeart, Pill } from "lucide-react";
import Link from "next/link";

export function CareItemHomeCard() {
  const { schedule, medicines, vaccines } = useCare();
  const { locale, t } = useLocale();
  const dict = t((d) => d.home.careItemCard);
  const dose = [...schedule].sort((a, b) => a.time.localeCompare(b.time)).find((item) => item.status === "upcoming");
  const medicine = medicines.find((item) => item.id === dose?.medicineId);
  const vaccine = vaccines.find((item) => item.status === "upcoming");
  const isMedicine = Boolean(dose && medicine);
  const title = isMedicine
    ? format(dict.medicineScheduled, { medicine: medicine?.name ?? "", time: dose?.time ?? "" })
    : vaccine
      ? format(dict.vaccineAppointment, { date: new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "long" }).format(new Date(`${vaccine.plannedDate}T12:00:00`)) })
      : dict.noneScheduled;
  return <section className="care-item-home-card"><div><span>{isMedicine ? <Pill size={18} /> : <CalendarHeart size={18} />}</span><p>{dict.label}</p></div><h2>{title}</h2><small>{dict.footer}</small><Link href={isMedicine ? "/medicine" : "/vaccines"}>{dict.button}</Link></section>;
}
