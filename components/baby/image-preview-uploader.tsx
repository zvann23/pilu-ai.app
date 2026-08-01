"use client";

import { BabyAvatar } from "@/components/baby/baby-avatar";
import { useLocale } from "@/components/i18n/locale-provider";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export function ImagePreviewUploader({ name, value, onChange }: { name: string; value?: string; onChange: (preview?: string) => void }) {
  const { t } = useLocale();
  const dict = t((d) => d.baby.photoUploader);
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError(dict.errorNotImage); return; }
    if (file.size > MAX_FILE_SIZE) { setError(dict.errorTooLarge); return; }
    const reader = new FileReader();
    reader.onload = () => { onChange(String(reader.result)); setError(null); };
    reader.readAsDataURL(file);
  }
  return <div className="image-preview-uploader"><BabyAvatar name={name} photoPreview={value} className="image-preview-uploader__avatar" /><div><input ref={input} type="file" accept="image/*" onChange={selectPhoto} hidden /><button type="button" className="button button--secondary" onClick={() => input.current?.click()}><ImagePlus size={16} aria-hidden="true" />{dict.changePhoto}</button>{value ? <button type="button" className="text-button text-button--danger" onClick={() => onChange(undefined)}><Trash2 size={15} aria-hidden="true" />{dict.removePhoto}</button> : null}{error ? <p role="alert">{error}</p> : <span>{dict.savedNote}</span>}</div></div>;
}
