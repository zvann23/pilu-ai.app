import { roleLabels, type FamilyRole } from "@/types/family";

export function RoleBadge({ role }: { role: FamilyRole }) {
  return <span className={`role-badge role-badge--${role}`}>{roleLabels[role]}</span>;
}
