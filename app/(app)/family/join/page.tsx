import { FamilyJoinPage } from "@/components/family/family-join-page";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<SkeletonScreen />}>
      <FamilyJoinPage />
    </Suspense>
  );
}
