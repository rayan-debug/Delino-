'use client';

/**
 * Uploads one file and returns its URL.
 *
 * Prefers a signed direct-to-Cloudinary upload — the bytes never touch our
 * server, which is the only way a video larger than Vercel's ~4.5MB request
 * body limit can be uploaded at all. Falls back to POSTing through
 * /api/upload when Cloudinary isn't configured (local dev writes to
 * public/uploads instead).
 */
export async function uploadFile(
  file: File,
  folder: string,
  onProgress?: (fraction: number) => void
): Promise<string> {
  const isVideo = file.type.startsWith('video/');

  const sigRes = await fetch('/api/upload/signature', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ folder, resourceType: isVideo ? 'video' : 'image' }),
  });

  if (sigRes.ok) {
    const sig = await sigRes.json();
    if (sig.configured) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sig.apiKey);
      fd.append('timestamp', String(sig.timestamp));
      fd.append('signature', sig.signature);
      fd.append('folder', sig.folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`;
      return await xhrUpload(endpoint, fd, onProgress);
    }
  }

  // Local dev fallback.
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? 'Upload failed');
  return data.url as string;
}

/**
 * XHR rather than fetch: uploading a 60MB clip with no progress feedback looks
 * like a hung page, and fetch still can't report request progress.
 */
function xhrUpload(
  url: string,
  fd: FormData,
  onProgress?: (fraction: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url as string);
        } else {
          reject(new Error(data?.error?.message ?? `Upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(fd);
  });
}
