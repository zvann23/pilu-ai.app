import { AppShell } from "@/components/app/app-shell";
import { AuthenticatedAppGate } from "@/components/app/authenticated-app-gate";
import { ActivityProvider } from "@/components/activity/activity-provider";
import { BabyProfileProvider } from "@/components/baby/baby-profile-provider";
import { DevelopmentProvider } from "@/components/development/development-provider";
import { CareProvider } from "@/components/care/care-provider";
import { MemoryProvider } from "@/components/memory/memory-provider";
import { LibraryProvider } from "@/components/library/library-provider";

export default function ApplicationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthenticatedAppGate>
      <BabyProfileProvider><ActivityProvider><DevelopmentProvider><CareProvider><MemoryProvider><LibraryProvider><AppShell>{children}</AppShell></LibraryProvider></MemoryProvider></CareProvider></DevelopmentProvider></ActivityProvider></BabyProfileProvider>
    </AuthenticatedAppGate>
  );
}
