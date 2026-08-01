import { supabase } from "@/lib/supabase/client";

const BUCKET = "baby-avatars";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const KNOWN_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*);base64/)?.[1] || "image/jpeg";
  const ext = mime.split("/")[1] || "jpg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), ext };
}

/** Uploads a baby profile photo (as a data: URL from ImagePreviewUploader) and returns its public URL. */
export async function uploadBabyAvatarFile(familyId: string, babyId: string, dataUrl: string): Promise<string> {
  const { blob, ext } = dataUrlToBlob(dataUrl);
  if (blob.size > MAX_FILE_SIZE) throw new Error("Choose an image smaller than 4 MB.");

  const path = `${familyId}/${babyId}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { upsert: true, contentType: blob.type, cacheControl: "3600" });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Cache-busted so a re-upload to the same fixed path (upsert) shows immediately
  // instead of the browser/CDN serving the previous file at that same URL.
  return `${data.publicUrl}?v=${Date.now()}`;
}

export async function removeBabyAvatarFile(familyId: string, babyId: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove(KNOWN_EXTENSIONS.map((ext) => `${familyId}/${babyId}.${ext}`));
}
