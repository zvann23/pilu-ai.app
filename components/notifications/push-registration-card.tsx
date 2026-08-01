"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { getPushProvider } from "@/lib/push";
import { BellRing } from "lucide-react";
import { useMemo, useState } from "react";

export function PushRegistrationCard({ pushEnabled, onToggle }: { pushEnabled: boolean; onToggle: (enabled: boolean) => void }) {
  const { t } = useLocale();
  const nd = t((d) => d.notifications.push);
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
        <h2>{nd.title}</h2>
        {provider.isConfigured() ? (
          <>
            <p>{nd.bodyTemplate.replace("{provider}", provider.name === "fcm" ? nd.firebaseLabel : nd.oneSignalLabel)}</p>
            {pushEnabled ? (
              <span className="push-registration-card__status">{nd.enabledStatus}</span>
            ) : (
              <button type="button" className="button button--secondary" onClick={enable} disabled={status === "requesting"}>
                {status === "requesting" ? nd.requesting : nd.enableButton}
              </button>
            )}
            {status === "denied" && <p className="push-registration-card__error">{nd.deniedError}</p>}
          </>
        ) : (
          <p>{nd.notConnected}</p>
        )}
      </div>
    </section>
  );
}
