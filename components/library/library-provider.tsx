"use client";

import { usePiluData } from "@/components/data/pilu-data-provider";
import { getArticle } from "@/lib/library-data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ArticleBookmark, ArticleFeedback, ReadingHistoryEntry } from "@/types/library";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type LibraryContextValue = { bookmarks: ArticleBookmark[]; history: ReadingHistoryEntry[]; feedback: Record<string, ArticleFeedback | undefined>; isBookmarked: (slug: string) => boolean; toggleBookmark: (slug: string) => void; recordRead: (slug: string) => void; setFeedback: (slug: string, feedback: ArticleFeedback) => void; };
const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { configured, userId } = usePiluData();
  const [bookmarks, setBookmarks] = useState<ArticleBookmark[]>([]); const [history, setHistory] = useState<ReadingHistoryEntry[]>([]); const [feedback, setFeedback] = useState<Record<string, ArticleFeedback | undefined>>({});
  useEffect(() => {
    if (!configured || !userId) return;
    let cancelled = false;
    void (async () => { const supabase = createBrowserSupabaseClient(); const [{ data: saved }, { data: ratings }] = await Promise.all([supabase.from("article_bookmarks").select("article_slug, created_at").eq("user_id", userId), supabase.from("article_feedback").select("article_slug, was_helpful").eq("user_id", userId)]); if (cancelled) return; setBookmarks((saved || []).map((row) => ({ articleSlug: row.article_slug, savedAt: row.created_at }))); setFeedback(Object.fromEntries((ratings || []).map((row) => [row.article_slug, row.was_helpful ? "yes" : "notReally"]))); })();
    return () => { cancelled = true; };
  }, [configured, userId]);
  const isBookmarked = useCallback((slug: string) => bookmarks.some((bookmark) => bookmark.articleSlug === slug), [bookmarks]);
  const toggleBookmark = useCallback((slug: string) => { const existing = bookmarks.some((bookmark) => bookmark.articleSlug === slug); setBookmarks((current) => existing ? current.filter((bookmark) => bookmark.articleSlug !== slug) : [{ articleSlug: slug, savedAt: new Date().toISOString() }, ...current]); if (configured && userId) void (existing ? createBrowserSupabaseClient().from("article_bookmarks").delete().eq("user_id", userId).eq("article_slug", slug) : createBrowserSupabaseClient().from("article_bookmarks").insert({ user_id: userId, article_slug: slug })); }, [bookmarks, configured, userId]);
  const recordRead = useCallback((slug: string) => { if (!getArticle(slug)) return; setHistory((current) => [{ articleSlug: slug, openedAt: new Date().toISOString() }, ...current.filter((item) => item.articleSlug !== slug)].slice(0, 5)); }, []);
  const saveFeedback = useCallback((slug: string, response: ArticleFeedback) => { setFeedback((current) => ({ ...current, [slug]: response })); if (configured && userId) void createBrowserSupabaseClient().from("article_feedback").upsert({ user_id: userId, article_slug: slug, was_helpful: response === "yes" }, { onConflict: "user_id,article_slug" }); }, [configured, userId]);
  const value = useMemo<LibraryContextValue>(() => ({ bookmarks, history, feedback, isBookmarked, toggleBookmark, recordRead, setFeedback: saveFeedback }), [bookmarks, history, feedback, isBookmarked, toggleBookmark, recordRead, saveFeedback]);
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
export function useLibrary() { const context = useContext(LibraryContext); if (!context) throw new Error("useLibrary must be used inside LibraryProvider"); return context; }
