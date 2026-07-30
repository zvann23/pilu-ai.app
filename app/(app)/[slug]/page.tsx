import { ComingSoonCard } from "@/components/ui/coming-soon-card";
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
    return (
      <div className="app-page-stack">
        <PageHeader eyebrow="Pilu home" title="Good morning, Emma" description="2 months & 5 days old" />
        <section className="home-welcome-card" aria-label="Pilu dashboard welcome">
          <div className="home-welcome-card__orb" aria-hidden="true" />
          <p className="home-welcome-card__eyebrow">A gentle start to the day</p>
          <h2>Your Pilu dashboard is coming next.</h2>
          <p>For now, take a breath. Pilu will help you keep every little moment close.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Pilu" title={page.label} description={page.description} />
      <ComingSoonCard title={`${page.label} is coming soon`} description="We are carefully preparing this space for your family." />
    </div>
  );
}
