import { FamilyJoinPage } from "@/components/family/family-join-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="family-page" aria-busy="true" />}>
      <FamilyJoinPage />
    </Suspense>
  );
}
