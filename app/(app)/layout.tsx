import { AppShell } from "@/components/app/app-shell";
import { ActivityProvider } from "@/components/activity/activity-provider";
import { BabyProfileProvider } from "@/components/baby/baby-profile-provider";

export default function ApplicationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <BabyProfileProvider><ActivityProvider><AppShell>{children}</AppShell></ActivityProvider></BabyProfileProvider>;
}
