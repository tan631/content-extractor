export type Platform = 'youtube' | 'tiktok' | 'twitter' | 'instagram' | 'facebook' | 'xiaohongshu' | 'douyin' | 'unknown';

export interface ExtractResult {
  platform: Platform;
  videoUrl?: string;
  thumbnail?: string;
  title?: string;
  transcript?: string;
  contentType: 'video' | 'transcript' | 'both';
}

export function detectPlatform(url: string): Platform {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
    if (hostname.includes('tiktok.com')) return 'tiktok';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('xiaohongshu.com') || hostname.includes('xhslink.com')) return 'xiaohongshu';
    if (hostname.includes('douyin.com')) return 'douyin';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    const shortsMatch = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return shortsMatch[1];
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

// Parse XML caption format to plain text
function parseCaptionXml(xml: string): string {
  return xml
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse JSON3 caption format to plain text
function parseCaptionJson3(data: { events?: Array<{ segs?: Array<{ utf8?: string }> }> }): string {
  return (data.events ?? [])
    .flatMap(e => e.segs ?? [])
    .map(s => s.utf8 ?? '')
    .join('')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchYouTubeTranscript(videoId: string): Promise<string | undefined> {
  try {
    const apiBase = process.env.TRANSCRIPT_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiBase}/transcript?videoId=${videoId}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return undefined;
    const data = await res.json() as { transcript?: string; error?: string };
    return data.transcript || undefined;
  } catch {
    return undefined;
  }
}

async function extractYouTube(url: string): Promise<ExtractResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('invalidUrl');

  // Fetch video metadata via YouTube Data API v3
  const metaRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  const meta = await metaRes.json() as {
    items?: Array<{
      snippet: {
        title: string;
        thumbnails: {
          maxres?: { url: string };
          high?: { url: string };
          medium?: { url: string };
        };
      };
    }>;
  };

  if (!meta.items?.length) throw new Error('extractFailed');

  const snippet = meta.items[0].snippet;
  const thumbnail =
    snippet.thumbnails.maxres?.url ??
    snippet.thumbnails.high?.url ??
    snippet.thumbnails.medium?.url;

  const transcript = await fetchYouTubeTranscript(videoId);

  return {
    platform: 'youtube',
    thumbnail,
    title: snippet.title,
    transcript,
    contentType: transcript ? 'transcript' : 'video',
  };
}

export async function extractContent(url: string): Promise<ExtractResult> {
  const platform = detectPlatform(url);
  if (platform === 'unknown') throw new Error('unsupportedPlatform');
  if (platform === 'youtube') return extractYouTube(url);
  throw new Error('unsupportedPlatform');
}
