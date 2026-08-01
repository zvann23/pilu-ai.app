import type { ChatDict } from "@/lib/i18n/dictionary/chat";

export const chat = {
  header: {
    title: "Pregúntale a Pilu",
    subtitle: "Compañero de IA para la crianza",
    newConversation: "Iniciar una nueva conversación",
  },
  disclaimer: "Pilu ofrece información general sobre crianza y no sustituye el consejo médico.",
  emptyState: {
    heading: "Aquí para cada pequeña pregunta",
    body: "Pilu usa el perfil de {name} para mantener las respuestas amables y relevantes.",
  },
  quickQuestions: {
    label: "Prueba una pregunta sencilla",
    questions: [
      "¿Por qué llora mi bebé?",
      "¿Qué temperatura debe tener el biberón?",
      "¿Cuánto sueño es normal?",
      "¿Por qué la caca de mi bebé es verde?",
      "¿Cada cuánto debo cambiar el pañal?",
      "¿Cómo puedo calmar a mi bebé?",
    ],
  },
  composer: {
    label: "Hazle una pregunta a Pilu",
    placeholder: "Pregunta lo que quieras sobre tu bebé…",
    sendLabel: "Enviar mensaje",
  },
  errors: {
    emptyMessage: "Escribe una pregunta antes de enviar.",
    freeLimitTemplate: "Los planes gratuitos incluyen {limit} preguntas por conversación — mejora a Elite para un Ask Pilu ilimitado.",
    failed: "Pilu no ha podido responder ahora mismo. Inténtalo de nuevo.",
    retry: "Inténtalo de nuevo",
  },
  urgency: {
    urgentTitle: "Busca ayuda urgente ahora",
    urgentBody: "Contacta de inmediato con los servicios de emergencia locales.",
    moderateTitle: "Considera contactar con tu pediatra",
    moderateBody: "Un pediatra puede ayudarte a decidir qué hacer a continuación.",
  },
  message: {
    you: "Tú",
    pilu: "Pilu",
    demoMode: "Modo demo",
    copyLabel: "Copiar la respuesta de Pilu",
  },
  typingLabel: "Pilu está pensando",
} satisfies ChatDict;
