"use client";

import { EliteBadge } from "@/components/ui/elite-badge";
import type { NavigationItem } from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DrawerItem({ item, onNavigate }: { item: NavigationItem; onNavigate: () => void }) {
  const pathname = usePathname();
  const href = `/${item.slug}`;
  const active = pathname === href;
  const Icon = item.icon;

  return (
    <Link href={href} onClick={onNavigate} className={`drawer-item${active ? " drawer-item--active" : ""}`} aria-current={active ? "page" : undefined}>
      <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      <span>{item.label}</span>
      {item.elite ? <EliteBadge /> : null}
    </Link>
  );
}
