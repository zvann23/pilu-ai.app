"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { RefreshCw } from "lucide-react";

export function ChatErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useLocale();
  return <div className="chat-error" role="alert"><p>{message}</p>{onRetry ? <button type="button" onClick={onRetry}><RefreshCw size={15} aria-hidden="true" />{t((d) => d.chat.errors.retry)}</button> : null}</div>;
}
