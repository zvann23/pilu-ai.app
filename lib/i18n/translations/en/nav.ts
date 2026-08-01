import type { NavDict } from "@/lib/i18n/dictionary/nav";

export const nav = {
  sections: {
    main: "Main",
    baby: "Baby",
    discover: "Discover",
    elite: "Pilu Elite",
    family: "Family",
    account: "Account",
  },
  items: {
    home: { label: "Home", description: "A gentle view of your baby's day." },
    askPilu: { label: "Ask Pilu", description: "A thoughtful space for your parenting questions." },
    timeline: { label: "Timeline", description: "A calm timeline of little moments." },
    quickAdd: { label: "Quick Add", description: "Capture a moment with just a few taps." },
    babyProfile: { label: "Baby Profile", description: "Your baby's profile and family details." },
    feeding: { label: "Feeding", description: "A simple place for feeding rhythms." },
    sleep: { label: "Sleep", description: "A softer way to understand sleep." },
    diapers: { label: "Diapers", description: "A quick overview of diaper changes." },
    growth: { label: "Growth", description: "Follow your baby's growth at their own pace." },
    milestones: { label: "Milestones", description: "Celebrate every new little thing." },
    vaccines: { label: "Vaccines", description: "Keep upcoming care moments close." },
    medicine: { label: "Medicine", description: "A calm place for medicine notes." },
    library: { label: "Baby Library", description: "Helpful guidance for each stage." },
    firstAid: { label: "First Aid", description: "Trusted first-aid essentials for parents." },
    solidFoods: { label: "Solid Foods", description: "A gentle guide to first foods." },
    memoryBook: { label: "Memory Book", description: "Save the moments you will want to remember." },
    sleepSounds: { label: "Sleep Sounds", description: "Premium sounds for peaceful routines." },
    reports: { label: "AI Reports", description: "Thoughtful summaries of your baby's patterns." },
    vision: { label: "Pilu Vision", description: "Scan food, bottles, labels and more." },
    smartRoutines: { label: "Smart Routines", description: "Flexible routines that grow with your family." },
    family: { label: "Shared Parents", description: "Keep everyone in sync with care." },
    notifications: { label: "Notifications", description: "Your gentle Pilu reminders and updates." },
    settings: { label: "Settings", description: "Personalize your Pilu experience." },
    subscription: { label: "Subscription", description: "Manage your Pilu plan." },
    help: { label: "Help & Support", description: "We are here when you need us." },
  },
  gates: {
    sleepSounds: {
      title: "Sleep Sounds is part of Pilu Elite",
      description: "Gentle, curated sounds to help your baby settle — unlocked with Elite or Premium.",
    },
    reports: {
      title: "AI Reports is part of Pilu Elite",
      description: "Thoughtful daily, weekly, and monthly summaries of your baby's patterns — unlocked with Elite or Premium.",
    },
  },
} satisfies NavDict;
