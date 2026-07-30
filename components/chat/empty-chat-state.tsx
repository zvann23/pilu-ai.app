import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";

export function EmptyChatState({ name }: { name: string }) { return <div className="empty-chat-state"><PiluIllustration variant="teddy" className="empty-chat-state__illustration" /><div><Sparkles size={23} aria-hidden="true" /></div><h2>Here for every little question</h2><p>Pilu uses {name}&apos;s profile to keep answers gentle and relevant.</p></div>; }
