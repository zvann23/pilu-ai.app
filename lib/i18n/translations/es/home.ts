import type { HomeDict } from "@/lib/i18n/dictionary/home";

export const home = {
  greeting: {
    morning: "Buenos días,",
    afternoon: "Buenas tardes,",
    evening: "Buenas tardes,",
    night: "Buenas noches,",
  },
  askPiluCard: {
    heading: "Pregúntale a Pilu",
    description: "¿Preguntas sobre la alimentación, el sueño, el llanto o el desarrollo de tu bebé?",
    button: "Habla con Pilu",
  },
  insightCard: {
    heading: "Idea de hoy",
    body: "{name} tuvo una buena noche — 6h 45m de sueño con 2 despertares, y se alimentó bien.",
    footer: "Basado en la actividad simulada de hoy.",
  },
  latestReportCard: {
    eyebrow: "Pilu Elite",
    emptyHeading: "Tu primer informe con IA está listo para generarse",
    emptyDescription: "Un resumen tranquilo de la alimentación, el sueño, el crecimiento y los momentos felices.",
    generateButton: "Generar informe",
    latestPrefix: "Último informe con IA",
    viewButton: "Ver informe completo",
  },
  nextMilestoneCard: {
    label: "Próximo hito",
    body: "Es posible que {name} comience pronto con {milestone}.",
    footer: "Orientación general sobre el desarrollo",
    button: "Explorar hitos",
  },
  careItemCard: {
    label: "Próximo elemento de cuidado",
    medicineScheduled: "{medicine} programado a las {time}",
    vaccineAppointment: "Cita de vacuna el {date}",
    noneScheduled: "No hay ningún elemento de cuidado programado",
    footer: "Horario local introducido por el padre o la madre",
    button: "Ver detalles",
  },
  recentMemoryCard: {
    label: "Recuerdo reciente",
    favorite: "Guardado como favorito",
    button: "Abrir Libro de recuerdos",
  },
  remindersCard: {
    todayHeading: "Recordatorios de hoy",
    upcomingHeading: "Próximos recordatorios",
    button: "Gestionar recordatorios",
  },
  quickAdd: {
    heading: "Añadir rápido",
    subheading: "Registra una actividad reciente",
    sheetTitle: "Añadir rápido",
    closeLabel: "Cerrar añadir rápido",
  },
  recentActivity: {
    heading: "Actividad reciente",
    subheading: "Un vistazo rápido al día de hoy",
    button: "Ver cronología",
  },
  floatingAddButtonLabel: "Abrir añadir rápido",
  activityAddedToast: "Actividad añadida a la Cronología",
} satisfies HomeDict;
