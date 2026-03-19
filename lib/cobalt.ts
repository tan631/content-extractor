export type Platform = 'youtube' | 'tiktok' | 'twitter' | 'instagram' | 'facebook' | 'xiaohongshu' | 'douyin' | 'unknown';

export interface CobaltResult {
  status: 'tunnel' | 'redirect' | 'picker' | 'error';
  url?: string;
  picker?: Array<{ url: string; thumb?: string }>;
  error?: { code: string };
}

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

export async function extractContent(url: string): Promise<ExtractResult> {
  const platform = detectPlatform(url);
  if (platform === 'unknown') {
    throw new Error('unsupportedPlatform');
  }

  const res = await fetch('https://cobalt.tools/api', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, videoQuality: '1080', filenameStyle: 'pretty' })
  });

  if (!res.ok) throw new Error('extractFailed');

  const data: CobaltResult = await res.json();

  if (data.status === 'error') throw new Error('extractFailed');

  const videoUrl = data.url || data.picker?.[0]?.url;

  return {
    platform,
    videoUrl,
    contentType: videoUrl ? 'video' : 'transcript'
  };
}
