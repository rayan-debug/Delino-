import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

let configured = false;
function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export type UploadResult = { url: string; provider: 'cloudinary' | 'local' };
export type MediaKind = 'image' | 'video';

export type UploadOptions = {
  folder?: string;
  localBaseDir?: string;
  publicPath?: string;
  /** Defaults to 'image' so existing image callers are unaffected. */
  resourceType?: MediaKind;
  /** Cloudinary public_id (without folder or extension). Re-uploading the
   *  same id overwrites in place, which keeps repeated import runs idempotent. */
  publicId?: string;
};

/**
 * Upload a file buffer. In production with Cloudinary creds set, uses Cloudinary.
 * Otherwise (development) writes to apps/admin/public/uploads and returns a /uploads/... URL.
 *
 * Video uses Cloudinary's chunked upload endpoint — the plain upload stream
 * rejects payloads over 100MB, and clips routinely exceed that.
 */
export async function uploadMediaBuffer(
  buffer: Buffer,
  filename: string,
  opts: UploadOptions = {}
): Promise<UploadResult> {
  const resourceType: MediaKind = opts.resourceType ?? 'image';

  if (cloudinaryConfigured()) {
    configure();
    return new Promise<UploadResult>((resolve, reject) => {
      const params = {
        folder: opts.folder ?? 'luxora',
        resource_type: resourceType,
        ...(opts.publicId ? { public_id: opts.publicId, overwrite: true } : {}),
        ...(resourceType === 'video' ? { chunk_size: 20 * 1024 * 1024 } : {}),
      } as Record<string, unknown>;

      const handler = (err: unknown, result: { secure_url: string } | undefined) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'));
        resolve({ url: result.secure_url, provider: 'cloudinary' });
      };

      const stream =
        resourceType === 'video'
          ? cloudinary.uploader.upload_chunked_stream(params, handler as never)
          : cloudinary.uploader.upload_stream(params, handler as never);

      stream.end(buffer);
    });
  }

  // Local dev fallback
  const baseDir = opts.localBaseDir ?? path.join(process.cwd(), 'public', 'uploads');
  await mkdir(baseDir, { recursive: true });
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const finalName = `${Date.now()}_${safe}`;
  await writeFile(path.join(baseDir, finalName), buffer);
  const publicPath = opts.publicPath ?? '/uploads';
  return { url: `${publicPath}/${finalName}`, provider: 'local' };
}

/**
 * Back-compat alias. Existing callers pass images and expect the old name.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  opts: Omit<UploadOptions, 'resourceType'> = {}
): Promise<UploadResult> {
  return uploadMediaBuffer(buffer, filename, { ...opts, resourceType: 'image' });
}
