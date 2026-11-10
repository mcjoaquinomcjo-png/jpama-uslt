import { NextResponse } from "next/server";
import { extractAllGoogleDriveIds, bulkExtractDriveUrls } from "@/lib/imageUtils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawInput = body.input || body.folderUrl || "";

    if (!rawInput || typeof rawInput !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a Google Drive folder link or image URLs." },
        { status: 400 }
      );
    }

    const trimmed = rawInput.trim();

    // Check if the input is a Google Drive folder URL
    const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    const folderId = folderMatch ? folderMatch[1] : null;

    let extractedUrls: string[] = [];

    if (folderId) {
      try {
        // Attempt to fetch public folder HTML
        const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
        const res = await fetch(folderUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const html = await res.text();
          // Extract all drive file IDs inside the folder page, excluding the folder ID itself
          const ids = extractAllGoogleDriveIds(html).filter((id) => id !== folderId);
          if (ids.length > 0) {
            extractedUrls = ids.map(
              (id) => `https://drive.google.com/file/d/${id}/view?usp=drive_link`
            );
          }
        }
      } catch (err) {
        console.warn("Folder scraping notice (safe fallback):", err);
      }
    }

    // If folder scraping didn't yield images or it's a raw list of links/text,
    // use the robust regex extractor
    if (extractedUrls.length === 0) {
      extractedUrls = bulkExtractDriveUrls(trimmed);
      // Remove folder ID if present
      if (folderId) {
        extractedUrls = extractedUrls.filter((u) => !u.includes(folderId));
      }
    }

    return NextResponse.json({
      success: true,
      count: extractedUrls.length,
      urls: extractedUrls,
      folderId: folderId || undefined,
    });
  } catch (error: any) {
    console.error("Error extracting Google Drive links:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to parse Google Drive links." },
      { status: 500 }
    );
  }
}
