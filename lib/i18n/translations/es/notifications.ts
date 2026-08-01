import type { NotificationsDict } from "@/lib/i18n/dictionary/notifications";

export const notifications = {
  eyebrow: "Pilu",
  settingsPage: { title: "Notificaciones", subtitle: "Elige de qué debe recordarte Pilu.", inboxAriaLabel: "Abrir bandeja de notificaciones", loading: "Cargando…", remindersHeading: "Recordatorios", newReminder: "Nuevo recordatorio" },
  inboxPage: {
    title: "Bandeja de entrada", subtitle: "Todo lo que Pilu te ha comunicado.", markAllAria: "Marcar todo como leído", filterByStatusAria: "Filtrar por estado",
    statusTabs: { unread: "No leídas", read: "Leídas", archived: "Archivadas", all: "Todas" },
    filterByCategoryAria: "Filtrar por categoría", allCategories: "Todas las categorías", loading: "Cargando…",
    emptyTitle: "Nada aquí", emptyBody: "Las notificaciones aparecerán cuando Pilu tenga algo agradable que compartir.",
  },
  push: {
    title: "Notificaciones push", bodyTemplate: "Recibe recordatorios incluso cuando Pilu no está abierto, mediante {provider}.",
    firebaseLabel: "Firebase Cloud Messaging", oneSignalLabel: "OneSignal", enabledStatus: "Las notificaciones push están activadas en este dispositivo.",
    requesting: "Solicitando…", enableButton: "Activar notificaciones push",
    deniedError: "Se denegó el permiso — activa las notificaciones para Pilu en la configuración de tu navegador para intentarlo de nuevo.",
    notConnected: "Las notificaciones push aún no están conectadas en este entorno — los recordatorios en la app y de tipo correo siguen funcionando por completo. Pilu está preparado para admitir Firebase Cloud Messaging u OneSignal sin cambiar esta pantalla en cuanto se configure uno.",
  },
  preferences: {
    groupBabyCare: "Cuidado del bebé", groupParents: "Padres", quietHoursTitle: "Horas de silencio y horario",
    quietHoursToggleLabel: "Horas de silencio", quietHoursToggleDescription: "Pausa los recordatorios mientras tu familia probablemente esté durmiendo.",
    from: "Desde", to: "Hasta", daysLabel: "Días", timezoneLabel: "Zona horaria",
    daysModeLabels: { all: "Todos los días", weekdays: "Solo días laborables", weekends: "Solo fines de semana" },
    meta: {
      feeding_reminder: { label: "Recordatorio de alimentación", description: "Un aviso suave en torno a la hora habitual de alimentación del bebé." },
      sleep_reminder: { label: "Recordatorio de sueño", description: "Un aviso suave en torno a la hora habitual de sueño del bebé." },
      medicine_reminder: { label: "Recordatorio de medicamento", description: "Cuando se acerca una dosis programada." },
      vaccine_reminder: { label: "Recordatorio de vacuna", description: "Cuando se acerca una vacuna programada." },
      growth_reminder: { label: "Recordatorio de crecimiento", description: "Un aviso para registrar una nueva medición." },
      memory_of_day: { label: "Recuerdo del día", description: "Un recuerdo favorito reaparecido de tu Libro de recuerdos." },
      weekly_report_ready: { label: "Informe de IA semanal listo", description: "Cuando un nuevo resumen de Informes IA está listo para leer." },
      family_activity: { label: "Nueva actividad familiar", description: "Cuando otro miembro de la familia registra cuidados o recuerdos." },
      elite_updates: { label: "Actualizaciones de funciones Elite", description: "Novedades sobre las nuevas funciones de Pilu Elite." },
    },
  },
  reminders: {
    emptyList: "Todavía no hay recordatorios.", sharedSuffix: " · Compartido", markDoneAriaTemplate: "Marcar {title} como hecho", deleteAriaTemplate: "Eliminar {title}",
    typeLabels: { vaccine: "Vacuna", doctor_appointment: "Cita médica", medicine: "Medicamento", birthday: "Cumpleaños", family_event: "Evento familiar", custom: "Personalizado" },
    recurrenceLabels: { once: "Una vez", daily: "Diario", weekly: "Semanal", monthly: "Mensual" },
  },
  reminderForm: {
    closeSheetAria: "Cerrar formulario de recordatorio", closeAria: "Cerrar", heading: "Nuevo recordatorio", titleLabel: "Título", titlePlaceholder: "p. ej., Próxima vacuna", typeLabel: "Tipo",
    dateLabel: "Fecha", timeLabel: "Hora", repeatsLabel: "Se repite",
    shareWithFamilyLabel: "Compartir con la familia", shareWithFamilyDescription: "Otros miembros activos de la familia podrán ver este recordatorio.", saveReminder: "Guardar recordatorio",
  },
  categoryLabels: {
    feeding_reminder: "Recordatorio de alimentación", sleep_reminder: "Recordatorio de sueño", medicine_reminder: "Recordatorio de medicamento",
    vaccine_reminder: "Recordatorio de vacuna", growth_reminder: "Recordatorio de crecimiento", memory_of_day: "Recuerdo del día",
    weekly_report_ready: "Informe de IA semanal", family_activity: "Actividad familiar", elite_updates: "Actualización Elite",
    daily_summary: "Resumen diario", weekly_summary: "Resumen semanal", custom_reminder: "Recordatorio",
  },
  item: { archiveAria: "Archivar", deleteAria: "Eliminar", minutesAgoTemplate: "hace {m}m", hoursAgoTemplate: "hace {h}h" },
} satisfies NotificationsDict;
