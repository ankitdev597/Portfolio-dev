import { profile } from "@/data/profile";
import { getSiteUrl } from "@/lib/site-url";

export function buildShareText(): string {
  const url = getSiteUrl();
  return [
    profile.fullName,
    profile.headline,
    `Phone: ${profile.phone}`,
    `Email: ${profile.email}`,
    `Portfolio: ${url}`,
    "",
    "Scan the QR or open the link — Immediate Joiner · Full Stack · AI · AWS",
  ].join("\n");
}

export function whatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Share file via Web Share API when possible; returns true if shared. */
export async function shareFiles(opts: {
  files: File[];
  title: string;
  text: string;
}): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;

  const canFiles = navigator.canShare?.({ files: opts.files }) ?? false;
  try {
    if (canFiles) {
      await navigator.share({
        files: opts.files,
        title: opts.title,
        text: opts.text,
      });
      return true;
    }
    await navigator.share({
      title: opts.title,
      text: opts.text,
      url: getSiteUrl(),
    });
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return true;
    return false;
  }
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
