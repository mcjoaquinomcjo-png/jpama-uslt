/**
 * Utility functions for handling images, including Google Drive sharing links,
 * direct uploads (base64 data URLs), and image proxying.
 */

export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  // Patterns for Google Drive file links
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  const lh3Match = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
}

/**
 * Normalizes any image URL (standard URL, base64 data URI, or Google Drive link)
 * into a directly displayable image src.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Base64 data URLs or relative paths can be used directly
  if (trimmed.startsWith("data:image/") || trimmed.startsWith("/")) {
    return trimmed;
  }

  // Check if it's a Google Drive link
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    // Route via server-side proxy which fetches with browser User-Agent
    return `/api/image-proxy?id=${driveId}`;
  }

  return trimmed;
}

/**
 * Returns alternative fallback URLs for Google Drive images in case one CDN/endpoint fails.
 */
export function getDriveFallbackUrls(url: string): string[] {
  const driveId = extractGoogleDriveId(url);
  if (!driveId) return [];

  return [
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`,
    `https://lh3.googleusercontent.com/d/${driveId}`,
    `https://drive.google.com/uc?export=view&id=${driveId}`,
  ];
}

/**
 * Extracts all unique Google Drive file IDs from any raw text (e.g. multi-line paste,
 * chat export, CSV list, or HTML snippets containing Google Drive links).
 */
export function extractAllGoogleDriveIds(rawText: string): string[] {
  if (!rawText || typeof rawText !== "string") return [];

  const foundIds = new Set<string>();

  // Pattern 1: /file/d/<id>
  const fileDPattern = /\/file\/d\/([a-zA-Z0-9_-]{20,})/g;
  let match: RegExpExecArray | null;
  while ((match = fileDPattern.exec(rawText)) !== null) {
    if (match[1]) foundIds.add(match[1]);
  }

  // Pattern 2: id=<id>
  const idParamPattern = /[?&]id=([a-zA-Z0-9_-]{20,})/g;
  while ((match = idParamPattern.exec(rawText)) !== null) {
    if (match[1]) foundIds.add(match[1]);
  }

  // Pattern 3: lh3.googleusercontent.com/d/<id>
  const lh3Pattern = /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/g;
  while ((match = lh3Pattern.exec(rawText)) !== null) {
    if (match[1]) foundIds.add(match[1]);
  }

  // Pattern 4: Standalone Google Drive alphanumeric IDs (typically 33 chars, starts with 1)
  const standalonePattern = /(?<![a-zA-Z0-9_-])(1[a-zA-Z0-9_-]{25,45})(?![a-zA-Z0-9_-])/g;
  while ((match = standalonePattern.exec(rawText)) !== null) {
    // Avoid matching common words or short hashes
    if (match[1] && match[1].length >= 28) {
      foundIds.add(match[1]);
    }
  }

  return Array.from(foundIds);
}

/**
 * Parses raw text or a multi-line input and returns standard Google Drive view URLs
 * for each detected image, ready to save in the admin portal.
 */
export function bulkExtractDriveUrls(rawText: string): string[] {
  const ids = extractAllGoogleDriveIds(rawText);
  if (ids.length > 0) {
    return ids.map((id) => `https://drive.google.com/file/d/${id}/view?usp=drive_link`);
  }

  // If no Drive IDs matched, try parsing direct image URLs line by line
  const lines = rawText
    .split(/[\r\n,]+/)
    .map((l) => l.trim().replace(/^['"<]+|['">]+$/g, ""))
    .filter((l) => l.startsWith("http://") || l.startsWith("https://") || l.startsWith("data:image/"));

  return Array.from(new Set(lines));
}
