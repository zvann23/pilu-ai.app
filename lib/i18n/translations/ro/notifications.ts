import type { NotificationsDict } from "@/lib/i18n/dictionary/notifications";

export const notifications = {
  eyebrow: "Pilu",
  settingsPage: { title: "Notificări", subtitle: "Alege despre ce ar trebui să-ți amintească Pilu.", inboxAriaLabel: "Deschide căsuța de notificări", loading: "Se încarcă…", remindersHeading: "Mementouri", newReminder: "Memento nou" },
  inboxPage: {
    title: "Căsuță de mesaje", subtitle: "Tot ce ți-a comunicat Pilu.", markAllAria: "Marchează toate ca citite", filterByStatusAria: "Filtrează după stare",
    statusTabs: { unread: "Necitite", read: "Citite", archived: "Arhivate", all: "Toate" },
    filterByCategoryAria: "Filtrează după categorie", allCategories: "Toate categoriile", loading: "Se încarcă…",
    emptyTitle: "Nimic aici", emptyBody: "Notificările vor apărea aici de îndată ce Pilu are ceva de împărtășit.",
  },
  push: {
    title: "Notificări push", bodyTemplate: "Primește mementouri chiar și când Pilu nu este deschis, prin {provider}.",
    firebaseLabel: "Firebase Cloud Messaging", oneSignalLabel: "OneSignal", enabledStatus: "Notificările push sunt activate pe acest dispozitiv.",
    requesting: "Se solicită…", enableButton: "Activează notificările push",
    deniedError: "Permisiunea a fost refuzată — activează notificările pentru Pilu din setările browserului pentru a încerca din nou.",
    notConnected: "Notificările push nu sunt încă conectate pe acest mediu — mementourile în aplicație și de tip email funcționează în continuare pe deplin. Pilu este construit pentru a suporta Firebase Cloud Messaging sau OneSignal fără a schimba acest ecran odată ce unul este configurat.",
  },
  preferences: {
    groupBabyCare: "Îngrijirea bebelușului", groupParents: "Părinți", quietHoursTitle: "Ore liniștite și programare",
    quietHoursToggleLabel: "Ore liniștite", quietHoursToggleDescription: "Pune pauză mementourilor cât timp familia ta doarme probabil.",
    from: "De la", to: "Până la", daysLabel: "Zile", timezoneLabel: "Fus orar",
    daysModeLabels: { all: "În fiecare zi", weekdays: "Doar zile lucrătoare", weekends: "Doar weekenduri" },
    meta: {
      feeding_reminder: { label: "Memento de hrănire", description: "Un impuls blând în jurul orei obișnuite de hrănire a bebelușului." },
      sleep_reminder: { label: "Memento de somn", description: "Un impuls blând în jurul orei obișnuite de somn a bebelușului." },
      medicine_reminder: { label: "Memento de medicament", description: "Când urmează o doză programată." },
      vaccine_reminder: { label: "Memento de vaccin", description: "Când se apropie un vaccin programat." },
      growth_reminder: { label: "Memento de creștere", description: "Un impuls pentru a înregistra o măsurătoare nouă." },
      memory_of_day: { label: "Amintirea zilei", description: "O amintire favorită readusă din Cartea de amintiri." },
      weekly_report_ready: { label: "Raport AI săptămânal gata", description: "Când un nou rezumat de Rapoarte AI este gata de citit." },
      family_activity: { label: "Activitate nouă în familie", description: "Când un alt membru al familiei înregistrează îngrijire sau amintiri." },
      elite_updates: { label: "Actualizări funcții Elite", description: "Noutăți despre noile funcții Pilu Elite." },
    },
  },
  reminders: {
    emptyList: "Niciun memento încă.", sharedSuffix: " · Partajat", markDoneAriaTemplate: "Marchează {title} ca finalizat", deleteAriaTemplate: "Șterge {title}",
    typeLabels: { vaccine: "Vaccin", doctor_appointment: "Programare la medic", medicine: "Medicament", birthday: "Zi de naștere", family_event: "Eveniment de familie", custom: "Personalizat" },
    recurrenceLabels: { once: "O singură dată", daily: "Zilnic", weekly: "Săptămânal", monthly: "Lunar" },
  },
  reminderForm: {
    closeSheetAria: "Închide formularul de memento", closeAria: "Închide", heading: "Memento nou", titleLabel: "Titlu", titlePlaceholder: "de ex. Următorul vaccin", typeLabel: "Tip",
    dateLabel: "Data", timeLabel: "Ora", repeatsLabel: "Se repetă",
    shareWithFamilyLabel: "Distribuie familiei", shareWithFamilyDescription: "Ceilalți membri activi ai familiei vor putea vedea acest memento.", saveReminder: "Salvează mementoul",
  },
  categoryLabels: {
    feeding_reminder: "Memento de hrănire", sleep_reminder: "Memento de somn", medicine_reminder: "Memento de medicament",
    vaccine_reminder: "Memento de vaccin", growth_reminder: "Memento de creștere", memory_of_day: "Amintirea zilei",
    weekly_report_ready: "Raport AI săptămânal", family_activity: "Activitate familie", elite_updates: "Actualizare Elite",
    daily_summary: "Rezumat zilnic", weekly_summary: "Rezumat săptămânal", custom_reminder: "Memento",
  },
  item: { archiveAria: "Arhivează", deleteAria: "Șterge", minutesAgoTemplate: "acum {m}m", hoursAgoTemplate: "acum {h}h" },
} satisfies NotificationsDict;
