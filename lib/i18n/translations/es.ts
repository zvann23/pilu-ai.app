import type { Dictionary } from "@/lib/i18n/dictionary";

export const es = {
  settings: {
    eyebrow: "Pilu",
    title: "Ajustes",
    description: "Gestiona tu cuenta, privacidad y datos.",
    language: {
      heading: "Idioma",
      description: "Elige el idioma que Pilu usa en toda la aplicación.",
    },
    analytics: {
      heading: "Analítica",
      description: "Ayúdanos a entender cómo se usa Pilu. Nunca enviamos el nombre de tu bebé, tus notas ni las conversaciones con la IA.",
      toggleLabel: "Compartir datos de uso anónimos",
    },
    export: {
      heading: "Exporta tus datos",
      description: "Descarga tu perfil, tu pertenencia a la familia, los perfiles de bebés y todos los registros asociados a tu cuenta en un único archivo JSON.",
      button: "Exportar mis datos",
      buttonLoading: "Preparando…",
      error: "No hemos podido preparar tu exportación ahora mismo. Inténtalo de nuevo.",
    },
    legal: {
      heading: "Legal",
      privacyPolicy: "Política de privacidad",
    },
    danger: {
      heading: "Eliminar cuenta",
      description: "Elimina de forma permanente tu cuenta de Pilu y todos los registros, recuerdos y entradas del diario asociados a ella. Esta acción no se puede deshacer.",
      button: "Eliminar mi cuenta",
    },
    deleteDialog: {
      eyebrow: "Eliminar cuenta",
      title: "Esta acción no se puede deshacer",
      body1: "Tu perfil, los perfiles de bebés de los que eres el único propietario, y todos los registros, recuerdos y entradas del diario asociados a tu cuenta se eliminarán de forma permanente.",
      body2Strong: "Esto no cancela ninguna suscripción de Google Play.",
      body2Rest: "Si tienes una suscripción Elite o Premium activa, cancélala por separado en la aplicación o el sitio web de Play Store; de lo contrario, se te seguirá cobrando incluso después de eliminar tu cuenta.",
      typedConfirmLabel: "Escribe {word} para confirmar",
      cancel: "Cancelar",
      confirmButton: "Eliminar mi cuenta",
      confirmButtonLoading: "Eliminando…",
      genericError: "Algo salió mal. Inténtalo de nuevo.",
    },
  },
} satisfies Dictionary;
