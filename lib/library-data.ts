import type { LibraryDict } from "@/lib/i18n/dictionary/library";
import type { AgeRange, Article, ArticleCategory } from "@/types/library";

type Seed = { slug: string; category: ArticleCategory; ageRange: AgeRange; featured?: boolean };

export const ageFilters: AgeRange[] = ["All ages", "0–3 months", "3–6 months", "6–12 months", "1–2 years", "2–4 years"];

const seeds: Seed[] = [
  { slug: "why-newborns-cry", category: "newborn", ageRange: "0–3 months", featured: true },
  { slug: "understanding-newborn-sleep", category: "newborn", ageRange: "0–3 months" },
  { slug: "common-newborn-reflexes", category: "newborn", ageRange: "0–3 months" },
  { slug: "recognize-hunger-cues", category: "feeding", ageRange: "0–3 months" },
  { slug: "bottle-feeding-basics", category: "feeding", ageRange: "0–3 months" },
  { slug: "burping-a-baby", category: "feeding", ageRange: "0–3 months" },
  { slug: "signs-baby-may-be-full", category: "feeding", ageRange: "0–3 months" },
  { slug: "calm-bedtime-routine", category: "sleep", ageRange: "3–6 months" },
  { slug: "understanding-short-naps", category: "sleep", ageRange: "3–6 months" },
  { slug: "day-night-confusion", category: "sleep", ageRange: "0–3 months" },
  { slug: "common-reasons-babies-unsettled", category: "crying", ageRange: "0–3 months" },
  { slug: "gentle-ways-to-soothe", category: "crying", ageRange: "0–3 months" },
  { slug: "understanding-overstimulation", category: "crying", ageRange: "3–6 months" },
  { slug: "what-diaper-changes-can-tell-you", category: "diapers", ageRange: "0–3 months" },
  { slug: "wet-and-dirty-diaper-basics", category: "diapers", ageRange: "0–3 months" },
  { slug: "preventing-diaper-irritation", category: "diapers", ageRange: "0–3 months" },
  { slug: "when-baby-feels-warm", category: "health", ageRange: "0–3 months" },
  { slug: "making-everyday-spaces-safer", category: "safety", ageRange: "All ages" },
  { slug: "tummy-time-basics", category: "development", ageRange: "0–3 months" },
  { slug: "early-social-smiles", category: "development", ageRange: "0–3 months" },
  { slug: "supporting-play-first-months", category: "development", ageRange: "0–3 months" },
  { slug: "common-signs-of-teething", category: "teething", ageRange: "6–12 months" },
  { slug: "comforting-a-teething-child", category: "teething", ageRange: "6–12 months" },
  { slug: "preparing-for-solid-foods", category: "solidFoods", ageRange: "6–12 months" },
  { slug: "introducing-one-food-at-a-time", category: "solidFoods", ageRange: "6–12 months" },
  { slug: "resting-when-routines-overwhelm", category: "parentWellbeing", ageRange: "All ages" },
  { slug: "sharing-care-with-caregiver", category: "parentWellbeing", ageRange: "All ages" },
  { slug: "supporting-language-through-play", category: "agesOneToFour", ageRange: "1–2 years" },
  { slug: "toddler-routines-and-transitions", category: "agesOneToFour", ageRange: "2–4 years" },
];

export const librarySlugs = seeds.map((seed) => seed.slug);

function buildArticle(seed: Seed, index: number, dict: LibraryDict): Article {
  const content = dict.articles[seed.slug];
  return {
    slug: seed.slug,
    category: seed.category,
    ageRange: seed.ageRange,
    featured: seed.featured,
    title: content.title,
    summary: content.summary,
    tags: content.tags,
    readingTime: dict.ui.readingTimeTemplate.replace("{n}", String(3 + index % 4)),
    reviewedDate: dict.ui.reviewedDate,
    reviewLabel: dict.reviewLabel,
    illustration: index % 2 ? "teddy" : "sleeping-baby",
    sections: [
      { heading: dict.sectionHeadings.starting, body: content.summary },
      { heading: dict.sectionHeadings.notice, body: content.guide },
      { heading: dict.sectionHeadings.nextStep, body: content.action, tips: [...dict.genericTips] },
    ],
    keyTakeaways: [content.summary, ...dict.genericTakeaways],
    professionalHelp: content.help || dict.defaultProfessionalHelp,
    sourcesPlaceholder: dict.sourcesPlaceholder,
    relatedSlugs: [],
  };
}

/** Builds the full, locale-aware article list. Called with the current `dict.library` from `useLocale()`. */
export function buildLibraryArticles(dict: LibraryDict): Article[] {
  return seeds
    .map((seed, index) => buildArticle(seed, index, dict))
    .map((item, index, all) => ({ ...item, relatedSlugs: all.filter((candidate) => candidate.category === item.category && candidate.slug !== item.slug).slice(0, 3).map((candidate) => candidate.slug) }));
}

export function getArticle(articles: Article[], slug: string) { return articles.find((article) => article.slug === slug); }
export function searchArticles(articles: Article[], query: string, categoryLabels: Record<ArticleCategory, string>) { const term = query.trim().toLowerCase(); return !term ? articles : articles.filter((article) => [article.title, article.summary, categoryLabels[article.category], article.tags.join(" ")].join(" ").toLowerCase().includes(term)); }
export function matchesAge(article: Article, age: AgeRange) { return age === "All ages" || article.ageRange === "All ages" || article.ageRange === age; }
