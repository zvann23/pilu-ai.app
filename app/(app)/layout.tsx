import { AppShell } from "@/components/app/app-shell";
import { ActivityProvider } from "@/components/activity/activity-provider";
import { BabyProfileProvider } from "@/components/baby/baby-profile-provider";
import { DevelopmentProvider } from "@/components/development/development-provider";
import { CareProvider } from "@/components/care/care-provider";
import { MemoryProvider } from "@/components/memory/memory-provider";
import { LibraryProvider } from "@/components/library/library-provider";
import { PiluDataProvider } from "@/components/data/pilu-data-provider";
import { getPiluAuthState } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ApplicationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const auth = await getPiluAuthState();
  if (auth.configured && !auth.user) redirect("/auth");
  if (auth.configured && (!auth.profile || !auth.profile.onboarding_completed)) redirect("/onboarding");
  return <PiluDataProvider><BabyProfileProvider><ActivityProvider><DevelopmentProvider><CareProvider><MemoryProvider><LibraryProvider><AppShell>{children}</AppShell></LibraryProvider></MemoryProvider></CareProvider></DevelopmentProvider></ActivityProvider></BabyProfileProvider></PiluDataProvider>;
}
