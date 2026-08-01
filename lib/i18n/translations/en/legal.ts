import type { LegalDict } from "@/lib/i18n/dictionary/legal";

export const legal = {
  privacyPolicy: {
    eyebrow: "Legal", pageTitle: "Privacy Policy — Pilu",
    effectiveDateLabel: "Effective date:", effectiveDateValue: "[INSERT DATE]",
    lastUpdatedLabel: "Last updated:", lastUpdatedValue: "[INSERT DATE]",
    backToPilu: "Back to Pilu",
    introPara1: 'This Privacy Policy explains how Pilu ("Pilu," "we," "us," or "our") collects, uses, shares, and protects information when you use the Pilu application (the "App"). Pilu is developed by [INSERT LEGAL ENTITY NAME — e.g. Salmatek SRL / Salmatek PFA], based in Romania.',
    introPara2: "By using Pilu, you agree to the collection and use of information as described in this policy.",
    s1: {
      heading: "1. Who Pilu is for",
      body: "Pilu is designed for parents and caregivers of children from pregnancy through approximately age 4. Pilu is intended to be used by adults — the account holder must be 18 years or older. Information about a child (your baby) is entered by you, the parent or caregiver, on the child's behalf. Pilu is not directed at children and does not knowingly collect information directly from children.",
    },
    s2: {
      heading: "2. Information we collect",
      sub1Heading: "2.1 Account information",
      sub1Items: ["Name, email address, and profile photo (if provided via Google Sign-In)", "Authentication data (via Supabase Auth — email/password or Google OAuth)"],
      sub2Heading: "2.2 Family and baby information",
      sub2Items: [
        "Family/household structure, including other parents or caregivers you invite to share access",
        "Baby profile details: name, date of birth, sex",
        "Feeding, sleep, and diaper logs",
        "Growth measurements and milestones",
        "Vaccine and medicine records",
        "Photos and entries you add to the Memory Book or Daily Journal",
        "Notes, entries, and any other content you choose to record in the App",
      ],
      sub3Heading: "2.3 Conversations with Ask Pilu",
      sub3Items: ["Questions and messages you send to Pilu's AI assistant, and the context needed to answer them (e.g. your baby's age, relevant logged data)"],
      sub4Heading: "2.4 Subscription and billing information",
      sub4Item1: "Subscription tier (Free, Elite, or Premium) and billing status",
      sub4Item2: "Payments for Elite/Premium subscriptions are processed by Google Play Billing — Pilu does not receive or store your payment card details. Google's own privacy policy governs the payment transaction itself.",
      sub5Heading: "2.5 Usage and device information",
      sub5Items: ["Basic technical information (device type, app version, crash logs) to help us maintain and improve the App"],
    },
    s3: {
      heading: "3. How we use your information",
      lead: "We use the information we collect to:",
      items: [
        "Provide the App's core features (tracking, timeline, reminders, family sharing, Sleep Sounds, etc.)",
        "Power the Ask Pilu assistant, including sending relevant context to our AI provider (Google Gemini — see Section 4) to generate responses",
        "Process and manage Elite/Premium subscriptions",
        "Send you notifications you've opted into (e.g. reminders, family activity updates)",
        "Maintain the security, integrity, and reliability of the App",
        "Improve and develop new features",
      ],
      notSellPara: "We do not sell your personal information or your child's information to third parties, and we do not use it for advertising.",
    },
    s4: {
      heading: "4. How we share information",
      lead: "We share information only as needed to operate the App:",
      tableHeaders: { recipient: "Recipient", purpose: "Purpose", data: "Data involved" },
      rows: [
        { recipient: "Supabase", purpose: "Database hosting and authentication (hosted in the EU)", data: "All account, family, and baby data" },
        { recipient: "Google (Gemini API)", purpose: "Powers the Ask Pilu assistant", data: "Your questions and the context needed to answer them" },
        { recipient: "Google (Sign-In)", purpose: "Optional sign-in method", data: "Name, email, profile photo" },
        { recipient: "Google Play Billing", purpose: "Processes Elite/Premium subscription payments", data: "Subscription status; payment details are handled entirely by Google" },
        { recipient: "Vercel", purpose: "Application hosting", data: "Technical/usage data needed to serve the App" },
      ],
      closingPara: "We require these providers to handle your data securely and only for the purposes described here. We do not share your family's or baby's data with any other parent, caregiver, or family beyond the one you explicitly create or join.",
    },
    s5: {
      heading: "5. Family sharing",
      body: "If you invite other parents or caregivers to your family in Pilu, they will be able to see the baby profile(s) and logged data associated with that family, based on the permissions of their role. Only invite people you trust with this information.",
    },
    s6: {
      heading: "6. Data retention",
      body: "We retain your information for as long as your account is active, or as needed to provide the App's features (for example, keeping your baby's timeline and memories available to you over time). If you delete your account, we delete or anonymize your personal data within [INSERT TIMEFRAME — e.g. 30 days], except where we are required to retain certain records by law.",
    },
    s7: {
      heading: "7. Your rights",
      lead: "If you are located in the European Economic Area, the United Kingdom, or another jurisdiction with similar protections, you have the right to:",
      items: [
        { bold: "Access", rest: " the personal data we hold about you and your family" },
        { bold: "Correct", rest: " inaccurate data" },
        { bold: "Delete", rest: ' your account and associated data ("right to erasure")' },
        { bold: "Export", rest: ' your data in a portable format ("right to data portability")' },
        { bold: "Object to or restrict", rest: " certain processing" },
        { bold: "Withdraw consent", rest: " at any time where processing is based on consent" },
      ],
      contactPara: "To exercise any of these rights, contact us at [INSERT CONTACT EMAIL]. We will respond within the timeframe required by applicable law.",
    },
    s8: {
      heading: "8. Security",
      body: "We use industry-standard measures to protect your information, including encryption in transit, row-level security policies restricting data access to authorized family members only, and secure authentication. No method of storage or transmission is 100% secure, and we cannot guarantee absolute security.",
    },
    s9: {
      heading: "9. International data transfers",
      body: "Our primary database is hosted in the European Union (Frankfurt, via Supabase). Some service providers (such as Google, for Gemini AI and Sign-In) may process data outside the EU/EEA. Where this occurs, we rely on appropriate safeguards required by applicable data protection law.",
    },
    s10: {
      heading: "10. Children's privacy",
      body: "Pilu is a tool for parents and caregivers, not a service directed at or marketed to children. We do not knowingly allow children to create accounts or interact directly with the App. Information about a child is provided by their parent or legal guardian, who is responsible for the accuracy and appropriateness of what they record.",
    },
    s11: {
      heading: "11. Changes to this policy",
      body: 'We may update this Privacy Policy from time to time. If we make material changes, we will notify you in the App or by email before the changes take effect. The "Last updated" date at the top of this page reflects the most recent revision.',
    },
    s12: {
      heading: "12. Contact us",
      lead: "If you have questions about this Privacy Policy or how your data is handled, contact us at:",
      contactEmailPlaceholder: "[INSERT CONTACT EMAIL]",
      contactEntityPlaceholder: "[INSERT LEGAL ENTITY NAME AND ADDRESS, IF APPLICABLE]",
    },
    draftDisclaimer: "This document is a starting draft based on Pilu's current features. It should be reviewed by a qualified lawyer before publishing — particularly the sections on data retention timeframes, international transfers, and your specific obligations under Romanian/EU law (GDPR) — before this is treated as your final, binding policy.",
  },
} satisfies LegalDict;
