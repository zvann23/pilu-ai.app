"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
import { useSubscription } from "@/components/billing/subscription-provider";
import { format, useLocale } from "@/components/i18n/locale-provider";
import { trackAiConversationStarted } from "@/lib/analytics/analytics-service";
import { toMinimalBabyContext } from "@/lib/gemini/baby-context";
import { getMessageUrgency } from "@/lib/gemini/safety";
import type { ChatMessage, PiluResponse } from "@/types/chat";
import { useState } from "react";
import { ChatComposer } from "./chat-composer";
import { ChatDisclaimer } from "./chat-disclaimer";
import { ChatErrorCard } from "./chat-error-card";
import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { EmptyChatState } from "./empty-chat-state";
import { QuickQuestionChips } from "./quick-question-chips";

function isPiluResponse(value: unknown): value is PiluResponse { return Boolean(value && typeof value === "object" && typeof (value as PiluResponse).answer === "string" && typeof (value as PiluResponse).urgency === "string"); }
const messageId = () => `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const FREE_QUESTIONS_PER_SESSION = 5;

export function AskPiluPage() {
  const { profile } = useBabyProfile();
  const { hasFeature } = useSubscription();
  const { locale, t } = useLocale();
  const errorDict = t((d) => d.chat.errors);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("question") ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const questionsAsked = messages.filter((item) => item.role === "parent").length;
  async function send(question = draft) {
    const message = question.trim();
    if (!message || sending) { if (!message) setError(errorDict.emptyMessage); return; }
    if (!hasFeature("unlimited_ai") && questionsAsked >= FREE_QUESTIONS_PER_SESSION) {
      setError(format(errorDict.freeLimitTemplate, { limit: String(FREE_QUESTIONS_PER_SESSION) }));
      return;
    }
    if (messages.length === 0) trackAiConversationStarted();
    setError(null); setDraft(""); setLastQuestion(message); setSending(true);
    const newMessages: ChatMessage[] = [{ id: messageId(), role: "parent", text: message }];
    if (getMessageUrgency(message) === "urgent") newMessages.push({ id: messageId(), role: "safety", text: "urgent" });
    setMessages((current) => [...current, ...newMessages]);
    try {
      const response = await fetch("/api/ask-pilu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, babyContext: toMinimalBabyContext(profile), locale }) });
      const data: unknown = await response.json();
      if (!response.ok || !isPiluResponse(data)) throw new Error("Invalid response");
      setMessages((current) => [...current, { id: messageId(), role: "pilu", text: data.answer, response: data }]);
    } catch { setError(errorDict.failed); }
    finally { setSending(false); }
  }
  return <div className="ask-pilu-page"><ChatHeader disabled={sending || messages.length === 0} onNewConversation={() => { setMessages([]); setError(null); setDraft(""); }} />{messages.length === 0 ? <><EmptyChatState name={profile.preferredName} /><QuickQuestionChips onSelect={setDraft} /></> : <ChatMessageList messages={messages} sending={sending} />}{error ? <ChatErrorCard message={error} onRetry={lastQuestion ? () => send(lastQuestion) : undefined} /> : null}<div className="ask-pilu-page__bottom"><ChatComposer value={draft} sending={sending} onChange={(value) => { setDraft(value); if (error) setError(null); }} onSend={() => send()} /><ChatDisclaimer /></div></div>;
}
