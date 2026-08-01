import type { ChatDict } from "@/lib/i18n/dictionary/chat";

export const chat = {
  header: {
    title: "Ask Pilu",
    subtitle: "AI parenting companion",
    newConversation: "Start a new conversation",
  },
  disclaimer: "Pilu provides general parenting information and does not replace medical advice.",
  emptyState: {
    heading: "Here for every little question",
    body: "Pilu uses {name}'s profile to keep answers gentle and relevant.",
  },
  quickQuestions: {
    label: "Try a gentle question",
    questions: [
      "Why is my baby crying?",
      "How warm should the bottle be?",
      "How much sleep is normal?",
      "Why is my baby's poop green?",
      "How often should I change a diaper?",
      "How can I calm my baby?",
    ],
  },
  composer: {
    label: "Ask Pilu a question",
    placeholder: "Ask anything about your little one…",
    sendLabel: "Send message",
  },
  errors: {
    emptyMessage: "Please write a question before sending.",
    freeLimitTemplate: "Free plans include {limit} questions per conversation — upgrade to Elite for unlimited Ask Pilu.",
    failed: "Pilu couldn't answer right now. Please try again.",
    retry: "Try again",
  },
  urgency: {
    urgentTitle: "Get urgent help now",
    urgentBody: "Contact your local emergency services immediately.",
    moderateTitle: "Consider contacting your pediatrician",
    moderateBody: "A pediatrician can help you decide what to do next.",
  },
  message: {
    you: "You",
    pilu: "Pilu",
    demoMode: "Demo mode",
    copyLabel: "Copy Pilu response",
  },
  typingLabel: "Pilu is thinking",
} satisfies ChatDict;
