"use client";

import { FamilyProvider, useFamilyContext } from "@/components/family/family-provider";
import { DisplayNamePrompt } from "@/components/family/display-name-prompt";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const tabs = [
  { href: "/family", label: "Overview" },
  { href: "/family/members", label: "Members" },
  { href: "/family/invitations", label: "Invitations" },
  { href: "/family/settings", label: "Settings" },
];

export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <FamilyProvider>
      <FamilyGate>{children}</FamilyGate>
    </FamilyProvider>
  );
}

function FamilyGate({ children }: { children: ReactNode }) {
  const { isAuthLoading, isDisplayNameLoading, displayName, setDisplayName, family } = useFamilyContext();
  const pathname = usePathname();

  if (isAuthLoading || isDisplayNameLoading) {
    return <div className="family-page" aria-busy="true" />;
  }

  if (!displayName) {
    return (
      <div className="family-page">
        <DisplayNamePrompt onSave={setDisplayName} />
      </div>
    );
  }

  return (
    <div className="family-page">
      {family && pathname !== "/family/join" ? (
        <nav className="family-subnav" aria-label="Family sections">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className={pathname === tab.href ? "family-subnav__link family-subnav__link--active" : "family-subnav__link"}>
              {tab.label}
            </Link>
          ))}
        </nav>
      ) : null}
      {children}
    </div>
  );
}
