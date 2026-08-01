import type { Dictionary } from "@/lib/i18n/dictionary";

export const ro = {
  settings: {
    eyebrow: "Pilu",
    title: "Setări",
    description: "Gestionează-ți contul, confidențialitatea și datele.",
    language: {
      heading: "Limbă",
      description: "Alege limba pe care Pilu o folosește în aplicație.",
    },
    analytics: {
      heading: "Analiză",
      description: "Ajută-ne să înțelegem cum este folosit Pilu. Nu trimitem niciodată numele bebelușului tău, notițele sau conversațiile cu AI.",
      toggleLabel: "Distribuie date de utilizare anonime",
    },
    export: {
      heading: "Exportă-ți datele",
      description: "Descarcă-ți profilul, apartenența la familie, profilurile bebelușilor și toate înregistrările asociate contului tău într-un singur fișier JSON.",
      button: "Exportă datele mele",
      buttonLoading: "Se pregătește…",
      error: "Nu am putut pregăti exportul chiar acum. Te rugăm să încerci din nou.",
    },
    legal: {
      heading: "Legal",
      privacyPolicy: "Politica de confidențialitate",
    },
    danger: {
      heading: "Șterge contul",
      description: "Șterge definitiv contul tău Pilu și toate înregistrările, amintirile și notițele din jurnal asociate acestuia. Această acțiune nu poate fi anulată.",
      button: "Șterge-mi contul",
    },
    deleteDialog: {
      eyebrow: "Șterge contul",
      title: "Această acțiune nu poate fi anulată",
      body1: "Profilul tău, profilurile bebelușilor pe care le deții exclusiv și toate înregistrările, amintirile și notițele din jurnal asociate contului tău vor fi șterse definitiv.",
      body2Strong: "Aceasta nu anulează niciun abonament Google Play.",
      body2Rest: "Dacă ai un abonament activ Elite sau Premium, anulează-l separat din aplicația sau site-ul Play Store — altfel vei continua să fii taxat chiar și după ștergerea contului.",
      typedConfirmLabel: "Scrie {word} pentru a confirma",
      cancel: "Anulează",
      confirmButton: "Șterge-mi contul",
      confirmButtonLoading: "Se șterge…",
      genericError: "Ceva nu a mers bine. Te rugăm să încerci din nou.",
    },
  },
} satisfies Dictionary;
