import { Plus } from "lucide-react";

export function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return <button className="floating-add-button" type="button" onClick={onClick} aria-label="Open quick add"><Plus size={27} strokeWidth={2.4} aria-hidden="true" /></button>;
}
