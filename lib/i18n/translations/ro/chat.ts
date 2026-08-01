import type { ChatDict } from "@/lib/i18n/dictionary/chat";

export const chat = {
  header: {
    title: "Întreabă-l pe Pilu",
    subtitle: "Companion AI pentru părinți",
    newConversation: "Începe o conversație nouă",
  },
  disclaimer: "Pilu oferă informații generale pentru părinți și nu înlocuiește sfatul medical.",
  emptyState: {
    heading: "Aici pentru fiecare mică întrebare",
    body: "Pilu folosește profilul lui {name} pentru a păstra răspunsurile blânde și relevante.",
  },
  quickQuestions: {
    label: "Încearcă o întrebare simplă",
    questions: [
      "De ce plânge bebelușul meu?",
      "Cât de cald trebuie să fie biberonul?",
      "Cât somn este normal?",
      "De ce este verde scaunul bebelușului meu?",
      "Cât de des trebuie să schimb scutecul?",
      "Cum îmi pot liniști bebelușul?",
    ],
  },
  composer: {
    label: "Pune-i o întrebare lui Pilu",
    placeholder: "Întreabă orice despre cel mic…",
    sendLabel: "Trimite mesajul",
  },
  errors: {
    emptyMessage: "Te rugăm să scrii o întrebare înainte de a trimite.",
    freeLimitTemplate: "Planurile gratuite includ {limit} întrebări pe conversație — treci la Elite pentru Ask Pilu nelimitat.",
    failed: "Pilu nu a putut răspunde chiar acum. Te rugăm să încerci din nou.",
    retry: "Încearcă din nou",
  },
  urgency: {
    urgentTitle: "Solicită ajutor urgent acum",
    urgentBody: "Contactează imediat serviciile locale de urgență.",
    moderateTitle: "Ia în considerare să contactezi medicul pediatru",
    moderateBody: "Un medic pediatru te poate ajuta să decizi ce urmează.",
  },
  message: {
    you: "Tu",
    pilu: "Pilu",
    demoMode: "Mod demo",
    copyLabel: "Copiază răspunsul lui Pilu",
  },
  typingLabel: "Pilu se gândește",
} satisfies ChatDict;
