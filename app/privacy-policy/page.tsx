import { PrivacyPolicyContent } from "@/components/legal/privacy-policy-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Pilu" };

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
