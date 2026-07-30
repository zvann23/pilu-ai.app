import { RefreshCw } from "lucide-react";
export function ChatErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) { return <div className="chat-error" role="alert"><p>{message}</p>{onRetry ? <button type="button" onClick={onRetry}><RefreshCw size={15} aria-hidden="true" />Try again</button> : null}</div>; }
