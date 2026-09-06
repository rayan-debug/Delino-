// Media helpers shared by the web and admin apps.
//
// Deliberately free of node/Cloudinary SDK imports so client components can
// import it — `./cloudinary` pulls in `node:fs` and cannot be bundled for the
// browser.

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'];

/**
 * True when a stored media URL points at a video rather than an image.
 * Gallery entries are plain strings, so the extension is all we have to go on.
 * Query strings and Cloudinary transform segments are ignored.
 */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const clean = url.split(/[?#]/)[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

/**
 * A still frame to show before a video is played.
 *
 * Cloudinary can render one on the fly: swapping the extension to .jpg on a
 * /video/upload/ URL returns the first frame, and `so_1` seeks a second in to
 * avoid the black frames many clips open on. For any other host we have no way
 * to derive a poster, so the caller falls back to the project cover image.
 */
export function videoPosterUrl(url: string): string | null {
  if (!isVideoUrl(url)) return null;
  if (!/res\.cloudinary\.com\/.+\/video\/upload\//.test(url)) return null;
  return url
    .replace('/video/upload/', '/video/upload/so_1/')
    .replace(/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i, '.jpg');
}

/**
 * A still usable anywhere a plain CSS background is drawn (cards, tiles).
 * Passes images through untouched and swaps a video for its poster frame.
 * Returns an empty string when a video has no derivable poster — the caller's
 * tile then renders on its surface colour rather than a broken URL.
 */
export function stillImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (!isVideoUrl(url)) return url;
  return videoPosterUrl(url) ?? '';
}
