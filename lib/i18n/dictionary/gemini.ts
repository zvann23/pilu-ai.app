export type GeminiDict = {
  demo: {
    /** Contains `{name}` and `{message}` placeholders. */
    answerTemplate: string;
    followUpQuestion: string;
    action1: string;
    action2: string;
    disclaimer: string;
  };
  safeFallback: {
    answer: string;
    followUpQuestion: string;
    action: string;
    disclaimer: string;
  };
  urgentSafety: {
    answer: string;
    action1: string;
    action2: string;
    disclaimer: string;
  };
  routeErrors: {
    rateLimited: string;
    badRequest: string;
    serverError: string;
  };
};
