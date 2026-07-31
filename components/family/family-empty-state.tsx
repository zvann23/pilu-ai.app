import { Users } from "lucide-react";
import Link from "next/link";

export function FamilyEmptyState() {
  return (
    <div className="family-empty-state">
      <Users size={24} aria-hidden="true" />
      <p>You don&apos;t have a family yet.</p>
      <Link href="/family">Create or join one from Overview</Link>
    </div>
  );
}
