import { ComingSoonCard } from "@/components/ui/coming-soon-card";
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
import { PageHeader } from "@/components/ui/page-header";
import { getNavigationItem, navigationItems } from "@/lib/navigation";
import { notFound } from "next/navigation";

// "family" has its own literal app/(app)/family/ route tree and must not
// also be statically generated here, or the two routes collide.
export function generateStaticParams() {
  return navigationItems.filter(({ slug }) => slug !== "family").map(({ slug }) => ({ slug }));
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
    return <SleepSoundsDashboard />;
  }

  if (page.slug === "reports") {
    return <ReportsDashboard />;
  }

  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Pilu" title={page.label} description={page.description} />
      <ComingSoonCard title={`${page.label} is coming soon`} description="We are carefully preparing this space for your family." />
    </div>
  );
}
