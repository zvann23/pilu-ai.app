"use client";

import { BabyAvatar } from "@/components/baby/baby-avatar";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export function ImagePreviewUploader({ name, value, onChange }: { name: string; value?: string; onChange: (preview?: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > MAX_FILE_SIZE) { setError("Choose an image smaller than 4 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { onChange(String(reader.result)); setError(null); };
    reader.readAsDataURL(file);
  }
  return <div className="image-preview-uploader"><BabyAvatar name={name} photoPreview={value} className="image-preview-uploader__avatar" /><div><input ref={input} type="file" accept="image/*" onChange={selectPhoto} hidden /><button type="button" className="button button--secondary" onClick={() => input.current?.click()}><ImagePlus size={16} aria-hidden="true" />Change photo</button>{value ? <button type="button" className="text-button text-button--danger" onClick={() => onChange(undefined)}><Trash2 size={15} aria-hidden="true" />Remove photo</button> : null}{error ? <p role="alert">{error}</p> : <span>Saved when you finish and confirm the profile.</span>}</div></div>;
}
