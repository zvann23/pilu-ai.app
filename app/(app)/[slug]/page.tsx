import { GatedNavFeature } from "@/components/app/gated-nav-feature";
import { NavComingSoon } from "@/components/app/nav-coming-soon";
import { SettingsPage } from "@/components/settings/settings-page";
import { HomeDashboard } from "@/components/home/home-dashboard";
import { TimelineDashboard } from "@/components/timeline/timeline-dashboard";
import { BabyProfileDashboard } from "@/components/baby/baby-profile-dashboard";
import { AskPiluPage } from "@/components/chat/ask-pilu-page";
import { FeedingDashboard } from "@/components/feeding/feeding-dashboard";
import { SleepDashboard } from "@/components/sleep/sleep-dashboard";
import { GrowthDashboard } from "@/components/development/growth-dashboard";
import { MilestoneDashboard } from "@/components/development/milestone-dashboard";
import { VaccinesDashboard } from "@/components/care/vaccines-dashboard";
import { MedicineDashboard } from "@/components/care/medicine-dashboard";
import { MemoryBookDashboard } from "@/components/memory/memory-book-dashboard";
import { LibraryDashboard } from "@/components/library/library-dashboard";
import { SleepSoundsDashboard } from "@/components/sleep-sounds/sleep-sounds-dashboard";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";
import { VisionDashboard } from "@/components/vision/vision-dashboard";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { getNavigationItem, navigationItems } from "@/lib/navigation";
import { notFound } from "next/navigation";

// "family", "notifications", and "subscription" each have their own
// literal app/(app)/ route tree and must not also be statically
// generated here, or the routes collide.
const literalRouteSlugs = new Set(["family", "notifications", "subscription"]);
export function generateStaticParams() {
  return navigationItems.filter(({ slug }) => !literalRouteSlugs.has(slug)).map(({ slug }) => ({ slug }));
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getNavigationItem(slug);

  if (!page) notFound();

  if (page.slug === "home") {
    return <HomeDashboard />;
  }

  if (page.slug === "timeline") {
    return <TimelineDashboard />;
  }

  if (page.slug === "baby-profile") {
    return <BabyProfileDashboard />;
  }

  if (page.slug === "ask-pilu") {
    return <AskPiluPage />;
  }

  if (page.slug === "feeding") {
    return <FeedingDashboard />;
  }

  if (page.slug === "sleep") {
    return <SleepDashboard />;
  }

  if (page.slug === "growth") {
    return <GrowthDashboard />;
  }

  if (page.slug === "milestones") {
    return <MilestoneDashboard />;
  }

  if (page.slug === "vaccines") {
    return <VaccinesDashboard />;
  }

  if (page.slug === "medicine") {
    return <MedicineDashboard />;
  }

  if (page.slug === "memory-book") {
    return <MemoryBookDashboard />;
  }

  if (page.slug === "library") {
    return <LibraryDashboard />;
  }

  if (page.slug === "sleep-sounds") {
    return (
      <GatedNavFeature feature="sleep_sounds" navId="sleepSounds">
        <SleepSoundsDashboard />
      </GatedNavFeature>
    );
  }

  if (page.slug === "reports") {
    return (
      <GatedNavFeature feature="ai_reports" navId="reports">
        <ReportsDashboard />
      </GatedNavFeature>
    );
  }

  if (page.slug === "vision") {
    return <VisionDashboard />;
  }

  if (page.slug === "settings") {
    return <SettingsPage />;
  }

  return <NavComingSoon navId={page.id as keyof Dictionary["nav"]["items"]} slug={page.slug} />;
}
