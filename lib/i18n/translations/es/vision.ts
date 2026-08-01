import type { VisionDict } from "@/lib/i18n/dictionary/vision";

export const vision = {
  header: { eyebrow: "Pilu Vision", title: "Escanéalo, entiéndelo", subtitle: "Comida, biberones, etiquetas, ingredientes, juguetes y productos para bebés — Pilu Vision lee la foto y explica lo que ve." },
  categoryPickerAriaLabel: "Categoría de escaneo",
  categoryLabels: { food: "Comida", bottle: "Biberón", label: "Etiqueta", ingredients: "Ingredientes", toy: "Juguete", baby_product: "Producto para bebés", rash: "Análisis de sarpullido", skin: "Observaciones de la piel", stool: "Observaciones de las heces" },
  soonSuffix: "Pronto",
  soonTitle: "Próximamente",
  analyzing: "Analizando…",
  takePhoto: "Tomar foto",
  chooseFromGallery: "Elegir de la galería",
  quota: { unlimited: "Escaneos ilimitados con tu plan.", remainingTemplate: "{remaining} de {total} escaneos gratuitos restantes hoy.", upgrade: " Mejora para ilimitado" },
  result: { removeFromSaved: "Quitar de los escaneos guardados", saveThisScan: "Guardar este escaneo", worthDoubleChecking: "Vale la pena verificar" },
  history: { historyTab: "Historial", savedTab: "Escaneos guardados", listsAriaLabel: "Listas de escaneos", emptySaved: "Nada guardado todavía — toca el corazón de un escaneo para guardarlo aquí.", emptyHistory: "Tus escaneos aparecerán aquí.", deleteThisScan: "Eliminar este escaneo" },
  errors: {
    analyzeFailed: "Pilu Vision no pudo analizar esta foto ahora. Inténtalo de nuevo.",
    rateLimited: "Pilu necesita una pequeña pausa antes de analizar otra foto. Inténtalo de nuevo en un minuto.",
    photoRequired: "Se requiere una foto.",
    categoryUnavailable: "Este tipo de escaneo aún no está disponible.",
    authRequired: "Se requiere autenticación",
    familyRequired: "Necesitas una familia antes de usar Pilu Vision",
    babyRequired: "Añade el perfil de tu bebé antes de usar Pilu Vision",
    freeLimitTemplate: "Los planes gratuitos incluyen {limit} escaneos de Pilu Vision al día — mejora a Elite para escaneos ilimitados.",
    saveFailed: "Pilu Vision analizó esta foto pero no pudo guardarla. Inténtalo de nuevo.",
  },
  demo: {
    titleTemplate: "Modo demo: escaneo de {label}",
    summaryTemplate: "Modo demo: Pilu Vision identificaría aquí lo que hay en esta foto de {label}. Gemini no está conectado, así que esto es un marcador de posición.",
    keyPoint: "Modo demo: los detalles notables de la foto aparecerían aquí.",
    recommendation: "Modo demo: aquí aparecerían sugerencias suaves para los próximos pasos.",
    disclaimer: "Respuesta de demostración — Gemini no está conectado. Pilu Vision ofrece información general y no reemplaza el consejo médico.",
  },
  safeFallback: {
    title: "Pilu no pudo leer esta foto",
    summary: "Pilu no pudo preparar un análisis completo para esta foto ahora. Una foto clara y bien iluminada de la parte frontal del artículo o la etiqueta suele funcionar mejor.",
    recommendation: "Inténtalo de nuevo con una foto más clara o revisa el empaque directamente. Si te preocupa una cuestión de salud o seguridad, siempre está bien contactar a tu pediatra.",
    disclaimer: "Pilu Vision ofrece información general y no reemplaza el consejo médico ni la orientación profesional sobre seguridad de productos.",
  },
} satisfies VisionDict;
