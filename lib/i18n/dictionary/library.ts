import type { ArticleCategory, AgeRange } from "@/types/library";

export type LibraryArticleContent = {
  title: string;
  summary: string;
  guide: string;
  action: string;
  tags: string[];
  help?: string;
};

export type LibraryDict = {
  ui: {
    header: { eyebrow: string; title: string; subtitle: string };
    search: { srLabel: string; placeholder: string; resultsTemplate: string; clearAria: string };
    categoriesAll: string;
    categoriesSaved: string;
    disclaimer: string;
    featuredRead: string;
    readGuide: string;
    popularTopicsHeading: string;
    popularTopicsSubheading: string;
    /** Contains a `{name}` placeholder. */
    relevantForTemplate: string;
    relevantForSubtitle: string;
    savedSectionSubtitle: string;
    savedSectionTitle: string;
    recentSectionSubtitle: string;
    recentSectionTitle: string;
    latestSectionSubtitle: string;
    latestSectionTitle: string;
    /** Contains a `{query}` placeholder. */
    resultsForTemplate: string;
    savedReads: string;
    allAges: string;
    helpfulReads: string;
    nothingHereYet: string;
    emptySearch: [string, string];
    emptySaved: [string, string];
    emptyRecent: [string, string];
    emptyArticles: [string, string];
    backToLibrary: string;
    continueGently: string;
    relatedArticles: string;
    keyTakeawaysHeading: string;
    professionalHelpHeading: string;
    feedbackQuestion: string;
    feedbackYes: string;
    feedbackNotReally: string;
    askPiluTitle: string;
    askPiluSubtitle: string;
    /** Contains a `{title}` placeholder. */
    askPiluQuestionTemplate: string;
    /** Contains a `{title}` placeholder. */
    bookmarkRemoveAriaTemplate: string;
    /** Contains a `{title}` placeholder. */
    bookmarkSaveAriaTemplate: string;
    /** Contains an `{n}` placeholder. */
    readingTimeTemplate: string;
    reviewedDate: string;
  };
  categories: Record<ArticleCategory, string>;
  ageRangeLabels: Record<AgeRange, string>;
  sectionHeadings: { starting: string; notice: string; nextStep: string };
  genericTips: [string, string, string];
  genericTakeaways: [string, string];
  defaultProfessionalHelp: string;
  sourcesPlaceholder: string;
  reviewLabel: string;
  popularTopics: { label: string; query: string }[];
  articles: Record<string, LibraryArticleContent>;
};
