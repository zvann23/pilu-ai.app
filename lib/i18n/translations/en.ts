import type { Dictionary } from "@/lib/i18n/dictionary";

export const en = {
  settings: {
    eyebrow: "Pilu",
    title: "Settings",
    description: "Manage your account, privacy, and data.",
    language: {
      heading: "Language",
      description: "Choose the language Pilu uses across the app.",
    },
    analytics: {
      heading: "Analytics",
      description: "Help us understand how Pilu is used. We never send your baby's name, notes, or AI conversations.",
      toggleLabel: "Share anonymous usage analytics",
    },
    export: {
      heading: "Export your data",
      description: "Download your profile, family membership, baby profiles, and every log tied to your account as a single JSON file.",
      button: "Export my data",
      buttonLoading: "Preparing…",
      error: "Couldn't prepare your export right now. Please try again.",
    },
    legal: {
      heading: "Legal",
      privacyPolicy: "Privacy Policy",
    },
    danger: {
      heading: "Delete account",
      description: "Permanently delete your Pilu account and every log, memory, and journal entry tied to it. This can't be undone.",
      button: "Delete my account",
    },
    deleteDialog: {
      eyebrow: "Delete account",
      title: "This can't be undone",
      body1: "Your profile, baby profiles you solely own, and every log, memory, and journal entry tied to your account will be permanently deleted.",
      body2Strong: "This does not cancel any Google Play subscription.",
      body2Rest: "If you have an active Elite or Premium subscription, cancel it separately in the Play Store app or website — otherwise you'll keep being charged even after your account is deleted.",
      typedConfirmLabel: "Type {word} to confirm",
      cancel: "Cancel",
      confirmButton: "Delete my account",
      confirmButtonLoading: "Deleting…",
      genericError: "Something went wrong. Please try again.",
    },
  },
} satisfies Dictionary;
