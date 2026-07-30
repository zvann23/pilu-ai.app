"use client";

import type { PiluResponse } from "@/types/chat";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { UrgencyCard } from "./urgency-card";

export function PiluMessage({ response }: { response: PiluResponse }) { const [copied, setCopied] = useState(false); const copy = async () => { try { await navigator.clipboard.writeText(response.answer); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } }; return <article className="chat-message chat-message--pilu"><div className="chat-message__meta"><span>Pilu</span>{response.demo ? <em>Demo mode</em> : null}<button type="button" aria-label="Copy Pilu response" onClick={copy}>{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}</button></div><UrgencyCard urgency={response.urgency} /><p>{response.answer}</p>{response.suggestedActions.length ? <ul>{response.suggestedActions.map((action) => <li key={action}>{action}</li>)}</ul> : null}{response.followUpQuestion ? <strong className="chat-message__follow-up">{response.followUpQuestion}</strong> : null}<small>{response.disclaimer}</small></article>; }
