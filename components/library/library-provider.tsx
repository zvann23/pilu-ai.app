"use client";

import { librarySlugs } from "@/lib/library-data";
import type { ArticleBookmark, ArticleFeedback, ReadingHistoryEntry } from "@/types/library";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type LibraryContextValue = { bookmarks: ArticleBookmark[]; history: ReadingHistoryEntry[]; feedback: Record<string, ArticleFeedback | undefined>; isBookmarked: (slug: string) => boolean; toggleBookmark: (slug: string) => void; recordRead: (slug: string) => void; setFeedback: (slug: string, feedback: ArticleFeedback) => void; };
const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<ArticleBookmark[]>([]); const [history, setHistory] = useState<ReadingHistoryEntry[]>([]); const [feedback, setFeedback] = useState<Record<string, ArticleFeedback | undefined>>({});
  const isBookmarked = useCallback((slug: string) => bookmarks.some((bookmark) => bookmark.articleSlug === slug), [bookmarks]);
  const toggleBookmark = useCallback((slug: string) => setBookmarks((current) => current.some((bookmark) => bookmark.articleSlug === slug) ? current.filter((bookmark) => bookmark.articleSlug !== slug) : [{ articleSlug: slug, savedAt: new Date().toISOString() }, ...current]), []);
  const recordRead = useCallback((slug: string) => { if (!librarySlugs.includes(slug)) return; setHistory((current) => [{ articleSlug: slug, openedAt: new Date().toISOString() }, ...current.filter((item) => item.articleSlug !== slug)].slice(0, 5)); }, []);
  const saveFeedback = useCallback((slug: string, response: ArticleFeedback) => setFeedback((current) => ({ ...current, [slug]: response })), []);
  const value = useMemo<LibraryContextValue>(() => ({
    bookmarks, history, feedback, isBookmarked, toggleBookmark, recordRead, setFeedback: saveFeedback,
  }), [bookmarks, history, feedback, isBookmarked, toggleBookmark, recordRead, saveFeedback]);
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() { const context = useContext(LibraryContext); if (!context) throw new Error("useLibrary must be used inside LibraryProvider"); return context; }
