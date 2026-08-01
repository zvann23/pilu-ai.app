import type { ActivityDict } from "@/lib/i18n/dictionary/activity";
import type { CommonDict } from "@/lib/i18n/dictionary/common";
import type { HomeDict } from "@/lib/i18n/dictionary/home";
import type { NavDict } from "@/lib/i18n/dictionary/nav";
import type { SettingsDict } from "@/lib/i18n/dictionary/settings";

export type Dictionary = {
  activity: ActivityDict;
  common: CommonDict;
  home: HomeDict;
  nav: NavDict;
  settings: SettingsDict;
};
