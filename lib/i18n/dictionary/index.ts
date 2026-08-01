import type { ActivityDict } from "@/lib/i18n/dictionary/activity";
import type { ChatDict } from "@/lib/i18n/dictionary/chat";
import type { CommonDict } from "@/lib/i18n/dictionary/common";
import type { GeminiDict } from "@/lib/i18n/dictionary/gemini";
import type { HomeDict } from "@/lib/i18n/dictionary/home";
import type { NavDict } from "@/lib/i18n/dictionary/nav";
import type { ReportsAiDict } from "@/lib/i18n/dictionary/reports-ai";
import type { SettingsDict } from "@/lib/i18n/dictionary/settings";
import type { TimelineDict } from "@/lib/i18n/dictionary/timeline";

export type Dictionary = {
  activity: ActivityDict;
  chat: ChatDict;
  common: CommonDict;
  gemini: GeminiDict;
  home: HomeDict;
  nav: NavDict;
  reportsAi: ReportsAiDict;
  settings: SettingsDict;
  timeline: TimelineDict;
};
