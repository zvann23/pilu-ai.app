"use client";

import { useBabyProfile } from "@/components/baby/baby-profile-provider";
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

export function AskPiluPage() {
  const { profile } = useBabyProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState("");
  async function send(question = draft) {
    const message = question.trim();
    if (!message || sending) { if (!message) setError("Please write a question before sending."); return; }
    setError(null); setDraft(""); setLastQuestion(message); setSending(true);
    const newMessages: ChatMessage[] = [{ id: messageId(), role: "parent", text: message }];
    if (getMessageUrgency(message) === "urgent") newMessages.push({ id: messageId(), role: "safety", text: "urgent" });
    setMessages((current) => [...current, ...newMessages]);
    try {
      const response = await fetch("/api/ask-pilu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, babyContext: toMinimalBabyContext(profile) }) });
      const data: unknown = await response.json();
      if (!response.ok || !isPiluResponse(data)) throw new Error("Invalid response");
      setMessages((current) => [...current, { id: messageId(), role: "pilu", text: data.answer, response: data }]);
    } catch { setError("Pilu couldn’t answer right now. Please try again."); }
    finally { setSending(false); }
  }
  return <div className="ask-pilu-page"><ChatHeader disabled={sending || messages.length === 0} onNewConversation={() => { setMessages([]); setError(null); setDraft(""); }} />{messages.length === 0 ? <><EmptyChatState name={profile.preferredName} /><QuickQuestionChips onSelect={setDraft} /></> : <ChatMessageList messages={messages} sending={sending} />}{error ? <ChatErrorCard message={error} onRetry={lastQuestion ? () => send(lastQuestion) : undefined} /> : null}<div className="ask-pilu-page__bottom"><ChatComposer value={draft} sending={sending} onChange={(value) => { setDraft(value); if (error) setError(null); }} onSend={() => send()} /><ChatDisclaimer /></div></div>;
}
