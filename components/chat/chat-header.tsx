import { Logo } from "@/components/branding/logo";
import { RotateCcw } from "lucide-react";

export function ChatHeader({ onNewConversation, disabled }: { onNewConversation: () => void; disabled: boolean }) { return <header className="chat-header"><div className="chat-header__mark"><Logo /><div><h1>Ask Pilu</h1><span>AI parenting companion</span></div></div><button type="button" className="icon-button icon-button--soft" aria-label="Start a new conversation" onClick={onNewConversation} disabled={disabled}><RotateCcw size={18} aria-hidden="true" /></button></header>; }
