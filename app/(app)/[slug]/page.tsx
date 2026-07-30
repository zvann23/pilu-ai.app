import { ComingSoonCard } from "@/components/ui/coming-soon-card";
import { HomeDashboard } from "@/components/home/home-dashboard";
import { TimelineDashboard } from "@/components/timeline/timeline-dashboard";
import { BabyProfileDashboard } from "@/components/baby/baby-profile-dashboard";
import { AskPiluPage } from "@/components/chat/ask-pilu-page";
import { PageHeader } from "@/components/ui/page-header";
import { getNavigationItem, navigationItems } from "@/lib/navigation";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return navigationItems.map(({ slug }) => ({ slug }));
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

  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Pilu" title={page.label} description={page.description} />
      <ComingSoonCard title={`${page.label} is coming soon`} description="We are carefully preparing this space for your family." />
    </div>
  );
}
