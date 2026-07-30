import { AppShell } from "@/components/app/app-shell";
import { ActivityProvider } from "@/components/activity/activity-provider";
import { BabyProfileProvider } from "@/components/baby/baby-profile-provider";
import { DevelopmentProvider } from "@/components/development/development-provider";
import { CareProvider } from "@/components/care/care-provider";
import { MemoryProvider } from "@/components/memory/memory-provider";

export default function ApplicationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <BabyProfileProvider><ActivityProvider><DevelopmentProvider><CareProvider><MemoryProvider><AppShell>{children}</AppShell></MemoryProvider></CareProvider></DevelopmentProvider></ActivityProvider></BabyProfileProvider>;
}
