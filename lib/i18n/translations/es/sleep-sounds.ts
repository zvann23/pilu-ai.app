import type { SleepSoundsDict } from "@/lib/i18n/dictionary/sleep-sounds";

export const sleepSounds = {
  header: { eyebrow: "Pilu Elite", title: "Sonidos para dormir", subtitle: "Sonidos relajantes que ayudan a tu bebé a quedarse dormido." },
  sections: {
    recommendedEyebrow: "Seleccionado para esta noche", recommendedTitle: "Recomendados",
    favoritesEyebrow: "Guardados para después", favoritesTitle: "Favoritos", favoritesEmpty: "Toca el corazón de cualquier sonido para guardarlo aquí.",
    whiteNoiseEyebrow: "Constante y familiar", natureEyebrow: "Al aire libre, con suavidad", lullabiesEyebrow: "Melodías suaves",
  },
  groupLabels: { "white-noise": "Ruido blanco", nature: "Naturaleza", lullabies: "Canciones de cuna" },
  favorite: { removeAriaTemplate: "Quitar {label} de favoritos", addAriaTemplate: "Añadir {label} a favoritos" },
  miniPlayer: { openAriaTemplate: "Abrir el reproductor de {name}", playing: "Reproduciendo", paused: "Pausado", pause: "Pausar", play: "Reproducir" },
  playerSheet: { closePlayer: "Cerrar reproductor", playerAriaTemplate: "Reproductor de {name}", volume: "Volumen", sleepTimer: "Temporizador de sueño", cancelTemplate: "Cancelar · {time}" },
  timerOptions: { min15: "15 min", min30: "30 min", min45: "45 min", min60: "60 min", manual: "Hasta detener" },
  elite: { title: "Sonidos para dormir es una función de Pilu Elite", body: "Desbloquea ruido blanco, sonidos de la naturaleza, canciones de cuna y más — con temporizadores, favoritos y reproducción en segundo plano — con Pilu Elite.", upgrade: "Mejorar a Elite" },
  sounds: {
    "white-noise": { name: "Ruido blanco", description: "Un murmullo uniforme de espectro completo que enmascara los sonidos repentinos del hogar." },
    fan: { name: "Ventilador", description: "El zumbido constante de un ventilador en una noche cálida." },
    "pink-noise": { name: "Ruido rosa", description: "Más suave y profundo que el ruido blanco, más amable para oídos pequeños." },
    "brown-noise": { name: "Ruido marrón", description: "Un grave profundo y retumbante, como un trueno lejano que nunca llega." },
    heartbeat: { name: "Latido del corazón", description: "Un latido tranquilo y constante, el sonido más familiar que existe." },
    "womb-sounds": { name: "Sonidos del vientre materno", description: "El murmullo amortiguado que los recién nacidos conocían antes de que el mundo se volviera ruidoso." },
    rain: { name: "Lluvia", description: "Una lluvia suave y constante sobre un techo tranquilo." },
    "ocean-waves": { name: "Olas del mar", description: "Olas lentas que llegan y se retiran." },
    forest: { name: "Bosque", description: "Viento entre las hojas y cantos de pájaros lejanos al atardecer." },
    fireplace: { name: "Chimenea", description: "Un fuego crepitante en una noche fría y acogedora." },
    lullaby: { name: "Canciones de cuna", description: "Una melodía de cuna suave y sin palabras en repetición." },
    piano: { name: "Piano", description: "Piano suave y lento, simple y tranquilo." },
    "music-box": { name: "Caja de música", description: "Una melodía delicada y familiar de caja de música." },
  },
} satisfies SleepSoundsDict;
