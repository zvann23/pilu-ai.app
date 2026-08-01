import type { AuthDict } from "@/lib/i18n/dictionary/auth";

export const auth = {
  login: {
    eyebrow: "Bine ai revenit", title: "Conectează-te la Pilu", subtitle: "Companionul calm al bebelușului tău, exact unde l-ai lăsat.",
    emailLabel: "Email", passwordLabel: "Parolă", signingIn: "Se conectează…", signIn: "Conectează-te",
    newToPilu: "Ești nou la Pilu?", createAccount: "Creează un cont", or: "sau",
    invalidCredentials: "Acest email și parola nu se potrivesc.",
    callbackFailed: "Linkul de conectare nu a funcționat — te rugăm să încerci din nou.",
  },
  signUp: {
    eyebrow: "Începe", title: "Creează-ți contul Pilu", subtitle: "Un spațiu calm și privat pentru micile momente ale familiei tale.",
    emailLabel: "Email", passwordLabel: "Parolă", or: "sau",
    passwordTooShort: "Parola trebuie să aibă cel puțin 8 caractere.",
    creatingAccount: "Se creează contul…", createAccount: "Creează cont",
    alreadyHaveAccount: "Ai deja un cont?", signIn: "Conectează-te", privacyPolicy: "Politica de confidențialitate",
    confirmationSentTemplate: "Verifică {email} pentru un link de confirmare pentru a finaliza crearea contului.",
    backToSignIn: "Înapoi la conectare",
  },
  google: { redirecting: "Se redirecționează…", continueWithGoogle: "Continuă cu Google" },
  onboarding: {
    eyebrow: "Aproape gata", title: "Configurează-ți familia", subtitle: "Câțiva pași rapizi și Pilu este gata pentru tine.",
    errorCreateFamily: "Familia nu a putut fi creată. Te rugăm să încerci din nou.",
    errorJoinInvite: "Codul de invitație nu a funcționat — verifică-l și încearcă din nou.",
    errorSaveBaby: "Profilul bebelușului nu a putut fi salvat. Te rugăm să încerci din nou.",
  },
  babyForm: {
    heading: "Spune-ne despre bebelușul tău", body: "Aceasta creează profilul real al bebelușului tău în Pilu. Doar numele este obligatoriu — adaugă restul oricând ești pregătit.",
    nameLabel: "Numele bebelușului", namePlaceholder: "Numele bebelușului", nicknameLabel: "Poreclă", nicknamePlaceholder: "Cum îi spui de obicei", optional: "Opțional",
    dobLabel: "Data nașterii", sexLabel: "Sex", sexNotSpecified: "Preferă să nu spună", sexFemale: "Feminin", sexMale: "Masculin", sexIntersex: "Intersex",
    birthWeightLabel: "Greutate la naștere (kg)", birthLengthLabel: "Lungime la naștere (cm)",
    motherNameLabel: "Numele mamei", motherNamePlaceholder: "Numele mamei", fatherNameLabel: "Numele tatălui", fatherNamePlaceholder: "Numele tatălui",
    saving: "Se salvează…", continueLabel: "Continuă",
  },
} satisfies AuthDict;
