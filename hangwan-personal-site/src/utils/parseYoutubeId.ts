/** Extract a YouTube video ID from a URL or bare ID string. */
export function parseYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const fromQuery = url.searchParams.get('v');
      if (fromQuery && /^[\w-]{11}$/.test(fromQuery)) return fromQuery;

      const embedMatch = url.pathname.match(/\/embed\/([\w-]{11})/);
      if (embedMatch) return embedMatch[1];

      const shortsMatch = url.pathname.match(/\/shorts\/([\w-]{11})/);
      if (shortsMatch) return shortsMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubePosterUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (autoplay) params.set('autoplay', '1');

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export interface YoutubeGalleryItemInput {
  type: 'youtube';
  videoId: string;
  label: string;
  poster?: string;
}

/** Build a YouTube gallery item from a URL or bare video ID. Returns null if invalid. */
export function youtubeGalleryItem(
  urlOrId: string,
  label: string,
  poster?: string,
): YoutubeGalleryItemInput | null {
  const videoId = parseYoutubeId(urlOrId);
  if (!videoId) return null;

  return {
    type: 'youtube',
    videoId,
    label,
    ...(poster ? { poster } : {}),
  };
}
