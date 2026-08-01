import type { AuthDict } from "@/lib/i18n/dictionary/auth";

export const auth = {
  login: {
    eyebrow: "Welcome back", title: "Sign in to Pilu", subtitle: "Your baby's calm companion, right where you left it.",
    emailLabel: "Email", passwordLabel: "Password", signingIn: "Signing in…", signIn: "Sign in",
    newToPilu: "New to Pilu?", createAccount: "Create an account", or: "or",
    invalidCredentials: "That email and password don't match.",
    callbackFailed: "That sign-in link didn't work — please try again.",
  },
  signUp: {
    eyebrow: "Get started", title: "Create your Pilu account", subtitle: "A calm, private space for your family's little moments.",
    emailLabel: "Email", passwordLabel: "Password", or: "or",
    passwordTooShort: "Password must be at least 8 characters.",
    creatingAccount: "Creating account…", createAccount: "Create account",
    alreadyHaveAccount: "Already have an account?", signIn: "Sign in", privacyPolicy: "Privacy Policy",
    confirmationSentTemplate: "Check {email} for a confirmation link to finish creating your account.",
    backToSignIn: "Back to sign in",
  },
  google: { redirecting: "Redirecting…", continueWithGoogle: "Continue with Google" },
  onboarding: {
    eyebrow: "Almost there", title: "Set up your family", subtitle: "A few quick steps and Pilu is ready for you.",
    errorCreateFamily: "Could not create your family. Please try again.",
    errorJoinInvite: "That invite code didn't work — check it and try again.",
    errorSaveBaby: "Could not save your baby's profile. Please try again.",
  },
  babyForm: {
    heading: "Tell us about your baby", body: "This creates your baby's real profile in Pilu. Only their name is required — add the rest whenever you're ready.",
    nameLabel: "Baby's name", namePlaceholder: "Baby's name", nicknameLabel: "Nickname", nicknamePlaceholder: "What you usually call them", optional: "Optional",
    dobLabel: "Date of birth", sexLabel: "Sex", sexNotSpecified: "Prefer not to say", sexFemale: "Female", sexMale: "Male", sexIntersex: "Intersex",
    birthWeightLabel: "Birth weight (kg)", birthLengthLabel: "Birth length (cm)",
    motherNameLabel: "Mom's name", motherNamePlaceholder: "Mom's name", fatherNameLabel: "Dad's name", fatherNamePlaceholder: "Dad's name",
    saving: "Saving…", continueLabel: "Continue",
  },
} satisfies AuthDict;
