import type { SleepSoundsDict } from "@/lib/i18n/dictionary/sleep-sounds";

export const sleepSounds = {
  header: { eyebrow: "Pilu Elite", title: "Sunete pentru somn", subtitle: "Sunete liniștitoare care îl ajută pe cel mic să adoarmă." },
  sections: {
    recommendedEyebrow: "Selecție pentru diseară", recommendedTitle: "Recomandate",
    favoritesEyebrow: "Păstrate pentru mai târziu", favoritesTitle: "Favorite", favoritesEmpty: "Atinge inima de pe orice sunet pentru a-l salva aici.",
    whiteNoiseEyebrow: "Constant și familiar", natureEyebrow: "Afară, cu blândețe", lullabiesEyebrow: "Melodii blânde",
  },
  groupLabels: { "white-noise": "Zgomot alb", nature: "Natură", lullabies: "Cântece de leagăn" },
  favorite: { removeAriaTemplate: "Elimină {label} din favorite", addAriaTemplate: "Adaugă {label} la favorite" },
  miniPlayer: { openAriaTemplate: "Deschide playerul {name}", playing: "Redare", paused: "Pauză", pause: "Pauză", play: "Redă" },
  playerSheet: { closePlayer: "Închide playerul", playerAriaTemplate: "Player {name}", volume: "Volum", sleepTimer: "Cronometru de somn", cancelTemplate: "Anulează · {time}" },
  timerOptions: { min15: "15 min", min30: "30 min", min45: "45 min", min60: "60 min", manual: "Până la oprire" },
  elite: { title: "Sunete pentru somn este o funcție Pilu Elite", body: "Deblochează zgomot alb, sunete din natură, cântece de leagăn și multe altele — cu cronometre, favorite și redare în fundal — cu Pilu Elite.", upgrade: "Treci la Elite" },
  sounds: {
    "white-noise": { name: "Zgomot alb", description: "O foșnitură uniformă, cu spectru complet, care acoperă zgomotele bruște din casă." },
    fan: { name: "Ventilator", description: "Vâjâitul constant al unui ventilator într-o noapte caldă." },
    "pink-noise": { name: "Zgomot roz", description: "Mai blând și mai adânc decât zgomotul alb, mai prietenos cu urechile micuțe." },
    "brown-noise": { name: "Zgomot maro", description: "Un bas profund și vibrant — ca un tunet îndepărtat care nu ajunge niciodată." },
    heartbeat: { name: "Bătăi de inimă", description: "O bătaie de inimă calmă și constantă — cel mai familiar sunet care există." },
    "womb-sounds": { name: "Sunete din pântec", description: "Foșnetul înăbușit pe care nou-născuții îl cunoșteau înainte ca lumea să devină zgomotoasă." },
    rain: { name: "Ploaie", description: "O ploaie blândă și constantă pe un acoperiș liniștit." },
    "ocean-waves": { name: "Valuri de ocean", description: "Valuri lente care se rostogolesc și se retrag." },
    forest: { name: "Pădure", description: "Vânt prin frunze și ciripit îndepărtat de păsări la asfințit." },
    fireplace: { name: "Șemineu", description: "Un foc trosnind într-o seară răcoroasă și confortabilă." },
    lullaby: { name: "Cântece de leagăn", description: "O melodie de leagăn blândă, fără cuvinte, în buclă." },
    piano: { name: "Pian", description: "Pian blând și lent — simplu și liniștit." },
    "music-box": { name: "Cutie muzicală", description: "O melodie delicată și familiară de cutie muzicală." },
  },
} satisfies SleepSoundsDict;
