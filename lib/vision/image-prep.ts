/** Downscales and compresses a photo before it's sent to the API route — a raw camera photo can be several MB, well past what a serverless request body should carry. */
export async function prepareImageForUpload(file: File, maxDimension = 1024, quality = 0.82): Promise<{ base64: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not supported");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const base64 = dataUrl.split(",")[1] ?? "";
    if (!base64) throw new Error("Could not read this photo");
    return { base64, mimeType: "image/jpeg" };
  } finally {
    bitmap.close();
  }
}
