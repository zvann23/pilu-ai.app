import { ChevronDown, Plus } from "lucide-react";

export function BabySelector({ name }: { name: string }) {
  return <div className="baby-selector"><button type="button" aria-label="Select baby"><span>{name}</span><ChevronDown size={16} aria-hidden="true" /></button><span><Plus size={14} aria-hidden="true" />Add another child <em>Coming later</em></span></div>;
}
