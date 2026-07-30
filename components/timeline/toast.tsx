import { Check } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="pilu-toast" role="status"><Check size={17} aria-hidden="true" />{message}</div>;
}
