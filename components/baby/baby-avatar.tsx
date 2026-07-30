"use client";

import Image from "next/image";
import { Baby } from "lucide-react";

export function BabyAvatar({ name, photoPreview, className = "" }: { name: string; photoPreview?: string; className?: string }) {
  if (photoPreview) return <div className={`baby-avatar ${className}`}><Image src={photoPreview} alt={`${name}'s profile photo`} fill sizes="96px" unoptimized /></div>;
  return <div className={`baby-avatar baby-avatar--placeholder ${className}`} aria-label={`${name}'s avatar`}><Baby size={30} aria-hidden="true" /></div>;
}
