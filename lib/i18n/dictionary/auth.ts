export type AuthDict = {
  login: {
    eyebrow: string; title: string; subtitle: string; emailLabel: string; passwordLabel: string;
    signingIn: string; signIn: string; newToPilu: string; createAccount: string; or: string;
    invalidCredentials: string; callbackFailed: string;
  };
  signUp: {
    eyebrow: string; title: string; subtitle: string; emailLabel: string; passwordLabel: string; or: string;
    passwordTooShort: string; creatingAccount: string; createAccount: string;
    alreadyHaveAccount: string; signIn: string; privacyPolicy: string;
    confirmationSentTemplate: string; backToSignIn: string;
  };
  google: { redirecting: string; continueWithGoogle: string };
  onboarding: {
    eyebrow: string; title: string; subtitle: string;
    errorCreateFamily: string; errorJoinInvite: string; errorSaveBaby: string;
  };
  babyForm: {
    heading: string; body: string; nameLabel: string; namePlaceholder: string; nicknameLabel: string; nicknamePlaceholder: string; optional: string;
    dobLabel: string; sexLabel: string; sexNotSpecified: string; sexFemale: string; sexMale: string; sexIntersex: string;
    birthWeightLabel: string; birthLengthLabel: string; motherNameLabel: string; motherNamePlaceholder: string; fatherNameLabel: string; fatherNamePlaceholder: string;
    saving: string; continueLabel: string;
  };
};
