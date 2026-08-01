import { ArticleReader } from "@/components/library/library-dashboard";
import { librarySlugs } from "@/lib/library-data";
import { notFound } from "next/navigation";

export function generateStaticParams() { return librarySlugs.map((slug) => ({ slug })); }
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!librarySlugs.includes(slug)) notFound(); return <ArticleReader slug={slug} />; }
