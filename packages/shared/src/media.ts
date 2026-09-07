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
 * Cloudinary delivery transforms.
 *
 * Anything uploaded through the admin is stored exactly as the file left the
 * camera or editor, and without a transform Cloudinary serves those bytes
 * verbatim — measured at ~366MB for six wedding clips. These parameters make
 * it transcode on delivery instead, which costs nothing extra and needs no
 * re-upload:
 *
 *   q_auto:eco  choose a bitrate by content, tuned for bandwidth
 *   vc_auto     pick a codec the requesting browser supports
 *   w_1280      cap the long edge; a portfolio never needs 4K
 *   c_limit     only ever scale down, never enlarge a smaller source
 *   f_auto      serve webp/avif to browsers that take them (images)
 */
const VIDEO_TRANSFORM = 'q_auto:eco,vc_auto,w_1280,c_limit';
const IMAGE_TRANSFORM = 'q_auto,f_auto,w_1600,c_limit';
const POSTER_TRANSFORM = 'so_1,q_auto,f_auto,w_800,c_limit';

/**
 * Insert a transform into a Cloudinary URL, if it doesn't already carry one.
 *
 * The segment straight after `/upload/` is the version (`v1788780739`) on a
 * plain URL and the transform on one that's already been processed, so keying
 * off the version makes this safely idempotent — calling it twice, or on a URL
 * someone hand-tuned in the admin, changes nothing.
 */
// Literal regexes rather than a built string: escaping `\d` through a template
// literal is easy to get subtly wrong, and a broken pattern here fails silently
// by returning the URL untransformed.
const UPLOAD_PATTERN = {
  video: /(\/video\/upload\/)(v\d+\/)/,
  image: /(\/image\/upload\/)(v\d+\/)/,
} as const;

function withTransform(url: string, kind: 'video' | 'image', transform: string): string {
  const pattern = UPLOAD_PATTERN[kind];
  if (!pattern.test(url)) return url;
  return url.replace(pattern, `$1${transform}/$2`);
}

/** A gallery/cover image served at a sane size and format. */
export function optimizedImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (!/res\.cloudinary\.com\/.+\/image\/upload\//.test(url)) return url;
  return withTransform(url, 'image', IMAGE_TRANSFORM);
}

/** A video transcoded on delivery rather than served as the original upload. */
export function optimizedVideoUrl(url: string): string {
  if (!isVideoUrl(url)) return url;
  if (!/res\.cloudinary\.com\/.+\/video\/upload\//.test(url)) return url;
  return withTransform(url, 'video', VIDEO_TRANSFORM);
}

/** Either kind, for callers holding a URL of unknown type. */
export function optimizedMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  return isVideoUrl(url) ? optimizedVideoUrl(url) : optimizedImageUrl(url);
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
  return withTransform(url, 'video', POSTER_TRANSFORM).replace(
    /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i,
    '.jpg'
  );
}

/**
 * A still usable anywhere a plain CSS background is drawn (cards, tiles).
 * Passes images through untouched and swaps a video for its poster frame.
 * Returns an empty string when a video has no derivable poster — the caller's
 * tile then renders on its surface colour rather than a broken URL.
 */
export function stillImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (!isVideoUrl(url)) return optimizedImageUrl(url);
  return videoPosterUrl(url) ?? '';
}
