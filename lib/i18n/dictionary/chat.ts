export type ChatDict = {
  header: {
    title: string;
    subtitle: string;
    newConversation: string;
  };
  disclaimer: string;
  emptyState: {
    heading: string;
    body: string;
  };
  quickQuestions: {
    label: string;
    questions: string[];
  };
  composer: {
    label: string;
    placeholder: string;
    sendLabel: string;
  };
  errors: {
    emptyMessage: string;
    freeLimitTemplate: string;
    failed: string;
    retry: string;
  };
  urgency: {
    urgentTitle: string;
    urgentBody: string;
    moderateTitle: string;
    moderateBody: string;
  };
  message: {
    you: string;
    pilu: string;
    demoMode: string;
    copyLabel: string;
  };
  typingLabel: string;
};
