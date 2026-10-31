import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const targetUrl = searchParams.get("url");

    let fetchUrl = "";
    if (id) {
      fetchUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
    } else if (targetUrl) {
      // If it's a google drive view link, extract ID
      const driveMatch = targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        fetchUrl = `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1600`;
      } else {
        fetchUrl = targetUrl;
      }
    }

    if (!fetchUrl) {
      return NextResponse.json({ error: "No image URL or ID provided" }, { status: 400 });
    }

    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    const contentType = res.headers.get("content-type") || "";

    // If Google returned an image, stream it directly
    if (res.ok && contentType.startsWith("image/")) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    // Try secondary Google Drive direct export endpoint
    const driveId = id || (targetUrl && (targetUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1]));
    if (driveId) {
      // 2. Try lh3.googleusercontent.com CDN (direct photo stream)
      try {
        const lh3Res = await fetch(`https://lh3.googleusercontent.com/d/${driveId}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "image/*,*/*;q=0.8",
          },
        });
        const lh3Type = lh3Res.headers.get("content-type") || "";
        if (lh3Res.ok && lh3Type.startsWith("image/")) {
          const buffer = await lh3Res.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": lh3Type,
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch (e) {}

      // 3. Try direct export endpoint
      try {
        const directRes = await fetch(`https://drive.usercontent.google.com/download?id=${driveId}&export=view`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        const directContentType = directRes.headers.get("content-type") || "";
        if (directRes.ok && directContentType.startsWith("image/")) {
          const buffer = await directRes.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": directContentType,
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      } catch (e) {}
    }

    // Fallback redirect to direct URL
    return NextResponse.redirect(fetchUrl);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
