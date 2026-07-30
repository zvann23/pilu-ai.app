import { activityMinutes, formatDuration } from "@/lib/activity-calculations";
import type { Activity } from "@/types/activity";
import type { JournalEntry, Memory, MemoryFilter, MemoryType, MonthlyRecap } from "@/types/memory";

export const memoryTypeLabels: Record<MemoryType, string> = {
  photo: "Photo", milestone: "Milestone", firstMoment: "First moment", dailyMoment: "Daily moment", familyMoment: "Family moment", growth: "Growth memory", custom: "Custom",
};

export const initialMemories: Memory[] = [
  { id: "memory-smile", type: "milestone", title: "First big smile", date: "2026-07-02", time: "09:30", caption: "The sweetest smile after breakfast.", favorite: true, privateNote: false, milestoneId: "social-smile", milestoneName: "First social smile", milestoneCategory: "Social", achievedDate: "2026-07-02", timelineActivityId: "memory-smile", source: "milestone" },
  { id: "memory-cuddles", type: "dailyMoment", title: "Morning cuddles", date: "2026-07-09", time: "07:15", caption: "A slow start together.", favorite: true, privateNote: false, source: "memoryBook" },
  { id: "memory-walk", type: "familyMoment", title: "First family walk", date: "2026-07-08", time: "18:00", caption: "A little fresh air before bedtime.", favorite: false, privateNote: false, milestoneId: "first-outing", milestoneName: "First outing", milestoneCategory: "First moments", achievedDate: "2026-05-14", timelineActivityId: "memory-outing", source: "milestone" },
  { id: "memory-sleepy", type: "dailyMoment", title: "Sleepy afternoon", date: "2026-07-06", time: "14:10", caption: "Tiny stretches and a warm nap.", favorite: false, privateNote: false, source: "memoryBook" },
  { id: "memory-hands", type: "photo", title: "Tiny hands", date: "2026-07-03", time: "11:00", caption: "Holding on to my finger.", favorite: true, privateNote: false, source: "memoryBook" },
  { id: "memory-bath", type: "firstMoment", title: "First bath at home", date: "2026-06-20", time: "19:10", caption: "Warm water and a very calm evening.", favorite: false, privateNote: false, milestoneId: "first-bath", milestoneName: "First bath", milestoneCategory: "First moments", achievedDate: "2026-05-08", source: "memoryBook" },
  { id: "memory-window", type: "dailyMoment", title: "Watching the window", date: "2026-06-16", caption: "A peaceful little pause in the daylight.", favorite: false, privateNote: false, source: "memoryBook" },
  { id: "memory-song", type: "familyMoment", title: "Grandma's song", date: "2026-06-11", caption: "A song that brought the room together.", favorite: true, privateNote: false, source: "memoryBook" },
  { id: "memory-yawn", type: "photo", title: "The biggest yawn", date: "2026-06-04", caption: "Caught just before a nap.", favorite: false, privateNote: false, source: "memoryBook" },
  { id: "memory-nap", type: "dailyMoment", title: "Cloud-soft nap", date: "2026-05-27", caption: "One of those very quiet afternoons.", favorite: false, privateNote: false, source: "memoryBook" },
  { id: "memory-home", type: "firstMoment", title: "Coming home", date: "2026-05-09", caption: "The first hello at home.", favorite: true, privateNote: false, source: "memoryBook" },
  { id: "memory-hello", type: "custom", title: "Hello, little one", date: "2026-05-06", caption: "The beginning of our family album.", favorite: false, privateNote: false, source: "memoryBook" },
];

export const initialJournalEntries: JournalEntry[] = [];

export function sortMemories(memories: Memory[]) { return [...memories].sort((first, second) => `${second.date}T${second.time ?? "00:00"}`.localeCompare(`${first.date}T${first.time ?? "00:00"}`)); }
export function monthKey(date: string) { return date.slice(0, 7); }
export function monthLabel(date: string) { return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(`${monthKey(date)}-01T12:00:00`)); }
export function formatMemoryDate(date: string, time?: string) { const formatted = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`)); return time ? `${formatted} · ${time}` : formatted; }
export function groupMemoriesByMonth(memories: Memory[]) { return sortMemories(memories).reduce<Record<string, Memory[]>>((groups, memory) => { const key = monthKey(memory.date); (groups[key] ??= []).push(memory); return groups; }, {}); }
export function filterMemories(memories: Memory[], filter: MemoryFilter) { return memories.filter((memory) => filter === "all" || filter === "favorites" && memory.favorite || filter === "milestones" && memory.type === "milestone" || filter === "photos" && memory.type === "photo" || filter === "firstMoments" && memory.type === "firstMoment"); }

export function createDailyActivitySummary(activities: Activity[], memoryCount: number) {
  const today = activities.filter((activity) => activity.dateKey === "today");
  const feedings = today.filter((activity) => ["feeding", "bottle", "breastfeeding"].includes(activity.kind)).length;
  const sleep = today.filter((activity) => activity.kind === "sleep").reduce((total, activity) => total + activityMinutes(activity.value), 0);
  const diapers = today.filter((activity) => activity.kind === "diaper").length;
  const parts = [`${feedings} feeding${feedings === 1 ? "" : "s"}`, `slept ${formatDuration(sleep)}`, `${diapers} diaper change${diapers === 1 ? "" : "s"}`];
  if (memoryCount) parts.push(`shared ${memoryCount === 1 ? "one special memory" : `${memoryCount} special memories`}`);
  return `Today Emma had ${parts.join(", ")}.`;
}

export function createMonthlyRecap(memories: Memory[], achievedMilestones: number, journals: JournalEntry[], date = "2026-07-10"): MonthlyRecap {
  const key = monthKey(date); const monthMemories = memories.filter((memory) => monthKey(memory.date) === key);
  return { label: `Emma's ${monthLabel(date).replace(" 2026", "")}`, memoryCount: monthMemories.length, milestoneCount: achievedMilestones, loggedDays: new Set(journals.filter((journal) => monthKey(journal.date) === key).map((journal) => journal.date)).size, favoriteMemory: sortMemories(monthMemories.filter((memory) => memory.favorite))[0], photoCount: monthMemories.filter((memory) => memory.type === "photo" || memory.imagePreview).length };
}
