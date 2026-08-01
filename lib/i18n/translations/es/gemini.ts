import type { GeminiDict } from "@/lib/i18n/dictionary/gemini";

export const gemini = {
  demo: {
    answerTemplate: "Modo demo: Pilu usaría el perfil de {name} para ofrecer una respuesta amable y adecuada a su edad. Para «{message}», un paso útil es observar cómo se alimenta, duerme y se calma tu bebé, y luego contactar con tu pediatra si estás preocupado/a.",
    followUpQuestion: "¿Cuándo notaste esto por primera vez?",
    action1: "Fíjate en los cambios en la alimentación, el sueño y el bienestar.",
    action2: "Anota cualquier cosa que parezca diferente.",
    disclaimer: "Respuesta de demostración — Gemini no está conectado. Pilu ofrece información general sobre crianza y no sustituye el consejo médico.",
  },
  safeFallback: {
    answer: "Pilu puede compartir información general sobre crianza, pero no he podido preparar una respuesta completa ahora mismo. Si estás preocupado/a por tu bebé, siempre está bien contactar con tu pediatra.",
    followUpQuestion: "¿Quieres contarme cuándo comenzó esto y cómo se ve tu bebé por lo demás?",
    action: "Observa cualquier cambio en la alimentación, el sueño o el bienestar.",
    disclaimer: "Pilu ofrece información general sobre crianza y no sustituye el consejo médico.",
  },
  urgentSafety: {
    answer: "Esto podría ser urgente. Contacta de inmediato con los servicios de emergencia locales o busca atención de urgencia ahora. Si es seguro hacerlo, quédate junto a tu bebé y sigue las instrucciones del personal de emergencias.",
    action1: "Contacta de inmediato con los servicios de emergencia locales.",
    action2: "No esperes una respuesta en línea antes de buscar ayuda urgente.",
    disclaimer: "Esta es una orientación general de seguridad, no un diagnóstico.",
  },
  routeErrors: {
    rateLimited: "Pilu necesita una pequeña pausa. Inténtalo de nuevo dentro de un minuto.",
    badRequest: "Escribe una pregunta breve para Pilu.",
    serverError: "Pilu no ha podido responder ahora mismo. Inténtalo de nuevo.",
  },
} satisfies GeminiDict;
