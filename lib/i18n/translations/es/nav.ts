import type { NavDict } from "@/lib/i18n/dictionary/nav";

export const nav = {
  sections: {
    main: "Principal",
    baby: "Bebé",
    discover: "Descubrir",
    elite: "Pilu Elite",
    family: "Familia",
    account: "Cuenta",
  },
  items: {
    home: { label: "Inicio", description: "Una vista tranquila del día de tu bebé." },
    askPilu: { label: "Pregúntale a Pilu", description: "Un espacio pensado para tus preguntas de crianza." },
    timeline: { label: "Cronología", description: "Una cronología tranquila de los pequeños momentos." },
    quickAdd: { label: "Añadir rápido", description: "Captura un momento con solo unos toques." },
    babyProfile: { label: "Perfil del bebé", description: "El perfil de tu bebé y los detalles de la familia." },
    feeding: { label: "Alimentación", description: "Un lugar sencillo para los ritmos de alimentación." },
    sleep: { label: "Sueño", description: "Una forma más amable de entender el sueño." },
    diapers: { label: "Pañales", description: "Un vistazo rápido a los cambios de pañal." },
    growth: { label: "Crecimiento", description: "Sigue el crecimiento de tu bebé a su propio ritmo." },
    milestones: { label: "Hitos", description: "Celebra cada cosa nueva." },
    vaccines: { label: "Vacunas", description: "Mantén cerca los próximos momentos de cuidado." },
    medicine: { label: "Medicamentos", description: "Un lugar tranquilo para notas sobre medicamentos." },
    library: { label: "Biblioteca Pilu", description: "Orientación útil para cada etapa." },
    firstAid: { label: "Primeros auxilios", description: "Información esencial de primeros auxilios, de confianza, para padres." },
    solidFoods: { label: "Alimentos sólidos", description: "Una guía amable para los primeros alimentos." },
    memoryBook: { label: "Libro de recuerdos", description: "Guarda los momentos que querrás recordar." },
    sleepSounds: { label: "Sonidos para dormir", description: "Sonidos premium para rutinas tranquilas." },
    reports: { label: "Informes con IA", description: "Resúmenes cuidados de los patrones de tu bebé." },
    vision: { label: "Pilu Vision", description: "Escanea alimentos, biberones, etiquetas y más." },
    smartRoutines: { label: "Rutinas inteligentes", description: "Rutinas flexibles que crecen con tu familia." },
    family: { label: "Padres compartidos", description: "Mantén a todos sincronizados en el cuidado." },
    notifications: { label: "Notificaciones", description: "Tus recordatorios y novedades de Pilu." },
    settings: { label: "Ajustes", description: "Personaliza tu experiencia con Pilu." },
    subscription: { label: "Suscripción", description: "Gestiona tu plan de Pilu." },
    help: { label: "Ayuda y soporte", description: "Estamos aquí cuando nos necesites." },
  },
  gates: {
    sleepSounds: {
      title: "Sonidos para dormir forma parte de Pilu Elite",
      description: "Sonidos suaves y cuidadosamente seleccionados para ayudar a tu bebé a calmarse — disponible con Elite o Premium.",
    },
    reports: {
      title: "Los informes con IA forman parte de Pilu Elite",
      description: "Resúmenes diarios, semanales y mensuales cuidados sobre los patrones de tu bebé — disponibles con Elite o Premium.",
    },
  },
} satisfies NavDict;
