import { ArticleReader } from "@/components/library/library-dashboard";
import { getArticle, libraryArticles } from "@/lib/library-data";
import { notFound } from "next/navigation";

export function generateStaticParams() { return libraryArticles.map((article) => ({ slug: article.slug })); }
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const article = getArticle(slug); if (!article) notFound(); return <ArticleReader article={article} />; }
