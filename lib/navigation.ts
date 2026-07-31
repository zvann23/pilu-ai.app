import type { LucideIcon } from "lucide-react";
import {
  Award, Bell, BookOpen, Camera, CircleHelp, Clock3, CreditCard, Droplets, HeartPulse, History, Home,
  Images, ListChecks, Milk, Moon, Pill, Plus, Settings, ShieldCheck, Sparkles, Utensils, Users,
  UserRound, Volume2,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  elite?: boolean;
};

export type NavigationSection = { title: string; items: NavigationItem[] };

export const navigationSections: NavigationSection[] = [
  { title: "Main", items: [
    { label: "Home", slug: "home", description: "A gentle view of your baby's day.", icon: Home },
    { label: "Ask Pilu", slug: "ask-pilu", description: "A thoughtful space for your parenting questions.", icon: Sparkles },
    { label: "Timeline", slug: "timeline", description: "A calm timeline of little moments.", icon: History },
    { label: "Quick Add", slug: "quick-add", description: "Capture a moment with just a few taps.", icon: Plus },
  ] },
  { title: "Baby", items: [
    { label: "Baby Profile", slug: "baby-profile", description: "Your baby's profile and family details.", icon: UserRound },
    { label: "Feeding", slug: "feeding", description: "A simple place for feeding rhythms.", icon: Milk },
    { label: "Sleep", slug: "sleep", description: "A softer way to understand sleep.", icon: Moon },
    { label: "Diapers", slug: "diapers", description: "A quick overview of diaper changes.", icon: Droplets },
    { label: "Growth", slug: "growth", description: "Follow your baby's growth at their own pace.", icon: HeartPulse },
    { label: "Milestones", slug: "milestones", description: "Celebrate every new little thing.", icon: Award },
    { label: "Vaccines", slug: "vaccines", description: "Keep upcoming care moments close.", icon: ShieldCheck },
    { label: "Medicine", slug: "medicine", description: "A calm place for medicine notes.", icon: Pill },
  ] },
  { title: "Discover", items: [
    { label: "Baby Library", slug: "library", description: "Helpful guidance for each stage.", icon: BookOpen },
    { label: "First Aid", slug: "first-aid", description: "Trusted first-aid essentials for parents.", icon: HeartPulse },
    { label: "Solid Foods", slug: "solid-foods", description: "A gentle guide to first foods.", icon: Utensils },
    { label: "Memory Book", slug: "memory-book", description: "Save the moments you will want to remember.", icon: Images },
  ] },
  { title: "Pilu Elite", items: [
    { label: "Sleep Sounds", slug: "sleep-sounds", description: "Premium sounds for peaceful routines.", icon: Volume2, elite: true },
    { label: "AI Reports", slug: "reports", description: "Thoughtful summaries of your baby's patterns.", icon: Sparkles, elite: true },
    { label: "Pilu Vision", slug: "vision", description: "Scan food, bottles, labels and more.", icon: Camera, elite: true },
    { label: "Smart Routines", slug: "smart-routines", description: "Flexible routines that grow with your family.", icon: ListChecks, elite: true },
  ] },
  { title: "Family", items: [
    { label: "Shared Parents", slug: "family", description: "Keep everyone in sync with care.", icon: Users },
    { label: "Notifications", slug: "notifications", description: "Your gentle Pilu reminders and updates.", icon: Bell },
  ] },
  { title: "Account", items: [
    { label: "Settings", slug: "settings", description: "Personalize your Pilu experience.", icon: Settings },
    { label: "Subscription", slug: "subscription", description: "Manage your Pilu plan.", icon: CreditCard },
    { label: "Help & Support", slug: "help", description: "We are here when you need us.", icon: CircleHelp },
  ] },
];

export const navigationItems = navigationSections.flatMap((section) => section.items);
export const getNavigationItem = (slug: string) => navigationItems.find((item) => item.slug === slug);
