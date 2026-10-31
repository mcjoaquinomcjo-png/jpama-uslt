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
