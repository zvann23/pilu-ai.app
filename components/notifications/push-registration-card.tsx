"use client";

import { getPushProvider } from "@/lib/push";
import { BellRing } from "lucide-react";
import { useMemo, useState } from "react";

export function PushRegistrationCard({ pushEnabled, onToggle }: { pushEnabled: boolean; onToggle: (enabled: boolean) => void }) {
  const provider = useMemo(() => getPushProvider(), []);
  const [status, setStatus] = useState<"idle" | "requesting" | "denied">("idle");

  async function enable() {
    if (!provider.isConfigured()) return;
    setStatus("requesting");
    const token = await provider.register();
    setStatus(token ? "idle" : "denied");
    if (token) onToggle(true);
  }

  return (
    <section className="push-registration-card">
      <BellRing size={22} aria-hidden="true" />
      <div>
        <h2>Push notifications</h2>
        {provider.isConfigured() ? (
          <>
            <p>Get reminders even when Pilu isn&apos;t open, via {provider.name === "fcm" ? "Firebase Cloud Messaging" : "OneSignal"}.</p>
            {pushEnabled ? (
              <span className="push-registration-card__status">Push is enabled on this device.</span>
            ) : (
              <button type="button" className="button button--secondary" onClick={enable} disabled={status === "requesting"}>
                {status === "requesting" ? "Requesting…" : "Enable push notifications"}
              </button>
            )}
            {status === "denied" && <p className="push-registration-card__error">Permission was declined — enable notifications for Pilu in your browser settings to try again.</p>}
          </>
        ) : (
          <p>Push notifications aren&apos;t connected yet on this deployment — in-app and email-style reminders still work fully. Pilu is built to support Firebase Cloud Messaging or OneSignal without changing this screen once one is configured.</p>
        )}
      </div>
    </section>
  );
}
