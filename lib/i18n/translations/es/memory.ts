import type { MemoryDict } from "@/lib/i18n/dictionary/memory";

export const memory = {
  header: { eyebrow: "Libro de recuerdos", addMemory: "Añadir recuerdo", memoriesLabel: "recuerdos", thisMonthLabel: "este mes", keptClose: "guardados con cariño" },
  filters: { all: "Todo", favorites: "Favoritos", milestones: "Hitos", photos: "Fotos", firstMoments: "Primeros momentos" },
  monthSection: { thisMonth: "Este mes", recentMemories: "Recuerdos recientes", earlier: "Anteriores", savedTemplate: "{count} guardados" },
  card: { openAriaTemplate: "Abrir recuerdo: {title}", removeFavoriteAriaTemplate: "Quitar {title} de favoritos", addFavoriteAriaTemplate: "Añadir {title} a favoritos" },
  detail: { closeLabel: "Cerrar detalle del recuerdo", memoryLabel: "Recuerdo", removeFavorite: "Quitar de favoritos", addFavorite: "Añadir a favoritos", privateNote: "Nota privada", share: "Compartir", edit: "Editar", delete: "Eliminar", achievedPrefix: "alcanzado" },
  addFlow: {
    editEyebrow: "Editar recuerdo", newEyebrow: "Un pequeño momento", editTitle: "Actualiza tu recuerdo", newTitle: "Añadir al Libro de recuerdos", closeLabel: "Cerrar formulario de recuerdo",
    memoryType: "Tipo de recuerdo", relatedMilestone: "Hito relacionado", optional: "Opcional", noRelatedMilestone: "Sin hito relacionado",
    title: "Título", titlePlaceholder: "p. ej., Primera gran sonrisa", date: "Fecha", time: "Hora",
    shortCaption: "Descripción breve", captionPlaceholder: "Unas palabras para recordarlo", longerNote: "Nota más larga", notePlaceholder: "Los detalles que querrás conservar...",
    keepFavorite: "Guardar como favorito", privateNoteCheckbox: "Nota privada", privateNotePlaceholder: "Marcador de posición para futuros controles de privacidad",
    cancel: "Cancelar", saveChanges: "Guardar cambios", saveMemory: "Guardar recuerdo",
    errorNoImage: "Elige un archivo de imagen para la vista previa local.", errorTooLarge: "Elige una imagen de menos de 6 MB.", errorNoTitle: "Añade un título breve para este recuerdo.",
  },
  imagePicker: { localPreview: "Vista previa de foto local", notUploaded: "Opcional, no se sube", remove: "Eliminar", imageDescription: "Descripción de la imagen", altTextOptional: "Texto alternativo opcional", uploadHint: "PNG, JPG o WebP de hasta 6 MB" },
  journal: { todaysJournal: "Diario de hoy", softRecord: "Un suave registro de hoy", edit: "Editar", addNote: "Añadir nota", noNoteYet: "Aún no hay ninguna nota personal. Añade una cuando te apetezca.", dailyJournal: "Diario", updateToday: "Actualizar hoy", saveToday: "Guardar hoy", closeLabel: "Cerrar formulario de diario", journalDate: "Fecha del diario", localSummary: "Resumen de actividad local", highlight: "Lo más destacado del día", highlightPlaceholder: "p. ej., Una tarde tranquila juntos", personalNote: "Nota personal", notePlaceholder: "Unas palabras para ti en el futuro...", cancel: "Cancelar", save: "Guardar diario" },
  journalHistory: { label: "Historial del diario", heading: "Los días que has guardado", editAriaTemplate: "Editar entrada del diario del {date}", deleteAriaTemplate: "Eliminar entrada del diario del {date}", defaultHighlight: "Un pequeño día juntos", emptyMessage: "Aún no hay entradas en el diario. La primera página de hoy te espera." },
  recap: { labelTemplate: "{month} de {name}", littleMoments: "Pequeños momentos, guardados juntos.", memories: "recuerdos", milestones: "hitos", loggedDays: "días registrados", photos: "fotos", favoritePrefix: "Favorito:", generateAiStory: "Generar historia con IA", aiComingSoon: "Las historias mensuales con IA estarán disponibles más adelante.", share: "Compartir", export: "Exportar", createAlbum: "Crear álbum" },
  emptyState: { favoritesTitle: "Aún no hay favoritos", favoritesHeading: "Guarda cerca los momentos que más importan.", quietPageTitle: "Una página tranquila", quietPageHeading: "Tu primer recuerdo está listo para guardarse.", allFilterSubtitle: "Aquí se reunirán las fotos, notas breves y recuerdos de hitos.", otherFilterSubtitle: "Prueba con otro filtro o añade un nuevo pequeño momento.", addMemory: "Añadir recuerdo" },
  deleteDialog: { eyebrow: "Libro de recuerdos", titleTemplate: "¿Eliminar {title}?", body: "Esto solo lo elimina de esta sesión local.", keep: "Mantener recuerdo", delete: "Eliminar", fallbackTitle: "este recuerdo" },
  toasts: { memoryUpdated: "Recuerdo actualizado", memorySaved: "Recuerdo guardado en tu libro", memoryRemoved: "Recuerdo eliminado de esta sesión local", journalRemoved: "Entrada del diario eliminada", journalUpdated: "Entrada del diario actualizada", journalSaved: "Diario de hoy guardado", sharingComingSoon: "Compartir y exportar álbumes llegará más adelante.", freeLimitTemplate: "Los planes gratuitos conservan tus últimos {limit} recuerdos — mejora a Elite para recuerdos ilimitados." },
  types: { photo: "Foto", milestone: "Hito", firstMoment: "Primer momento", dailyMoment: "Momento diario", familyMoment: "Momento familiar", growth: "Recuerdo de crecimiento", custom: "Personalizado" },
  dailySummary: { feedingOne: "toma", feedingOther: "tomas", slept: "durmió", diaperOne: "cambio de pañal", diaperOther: "cambios de pañal", memorySharedOne: "compartió un recuerdo especial", memorySharedOtherTemplate: "compartió {count} recuerdos especiales", todayTemplate: "Hoy {name} tuvo {parts}." },
} satisfies MemoryDict;
