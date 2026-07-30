"use client";

import { useActivities } from "@/components/activity/activity-provider";
import { useDevelopment } from "@/components/development/development-provider";
import { initialJournalEntries, initialMemories, sortMemories } from "@/lib/memory-data";
import type { JournalDraft, JournalEntry, Memory, MemoryDraft } from "@/types/memory";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type MemoryContextValue = {
  memories: Memory[];
  journalEntries: JournalEntry[];
  saveMemory: (draft: MemoryDraft, id?: string) => void;
  removeMemory: (id: string) => void;
  toggleFavorite: (id: string) => void;
  saveJournal: (draft: JournalDraft, id?: string) => void;
  removeJournal: (id: string) => void;
};

const MemoryContext = createContext<MemoryContextValue | null>(null);

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [localMemories, setLocalMemories] = useState(initialMemories.filter((memory) => memory.source !== "milestone"));
  const [journalEntries, setJournalEntries] = useState(initialJournalEntries);
  const { addActivity, updateActivity, removeActivity } = useActivities();
  const { milestones } = useDevelopment();

  const milestoneMemories = useMemo<Memory[]>(() => milestones.filter((milestone) => milestone.memoryActivityId).map((milestone) => ({
    id: milestone.memoryActivityId!, type: "milestone", title: milestone.title, date: milestone.achievedDate ?? "2026-07-10", time: "12:00",
    caption: milestone.note || `Celebrating ${milestone.title}.`, favorite: false, privateNote: false, milestoneId: milestone.id,
    milestoneName: milestone.title, milestoneCategory: milestone.category, achievedDate: milestone.achievedDate,
    timelineActivityId: milestone.memoryActivityId, source: "milestone",
  })), [milestones]);
  const memories = useMemo(() => sortMemories([...localMemories, ...milestoneMemories]), [localMemories, milestoneMemories]);

  const saveMemory = (draft: MemoryDraft, id?: string) => {
    const current = id ? localMemories.find((memory) => memory.id === id) : undefined;
    const activity = { kind: "memory" as const, dateKey: "today" as const, time: draft.time || "12:00", title: "Memory", value: draft.title, note: draft.caption || draft.note };
    let timelineActivityId = current?.timelineActivityId;
    if (timelineActivityId) updateActivity(timelineActivityId, activity); else timelineActivityId = addActivity(activity);
    const memory: Memory = { ...draft, id: id ?? `memory-${Date.now()}`, timelineActivityId, source: "memoryBook" };
    setLocalMemories((all) => sortMemories(id ? all.map((item) => item.id === id ? memory : item) : [memory, ...all]));
  };

  const removeMemory = (id: string) => {
    const target = localMemories.find((memory) => memory.id === id);
    if (!target) return;
    if (target.timelineActivityId) removeActivity(target.timelineActivityId);
    setLocalMemories((all) => all.filter((memory) => memory.id !== id));
  };
  const toggleFavorite = (id: string) => setLocalMemories((all) => all.map((memory) => memory.id === id ? { ...memory, favorite: !memory.favorite } : memory));
  const saveJournal = (draft: JournalDraft, id?: string) => setJournalEntries((all) => id ? all.map((entry) => entry.id === id ? { ...draft, id } : entry) : [{ ...draft, id: `journal-${Date.now()}` }, ...all]);
  const removeJournal = (id: string) => setJournalEntries((all) => all.filter((entry) => entry.id !== id));
  const value = { memories, journalEntries, saveMemory, removeMemory, toggleFavorite, saveJournal, removeJournal };
  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
}

export function useMemories() {
  const context = useContext(MemoryContext);
  if (!context) throw new Error("useMemories must be used inside MemoryProvider");
  return context;
}
