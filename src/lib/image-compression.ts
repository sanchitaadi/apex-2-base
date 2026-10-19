/**
 * Compresses and resizes an image file in the browser before uploading.
 * Reduces 5MB–12MB phone/camera photos down to ~150KB–300KB WebP/JPEG.
 * This prevents Supabase storage bandwidth caps from ever filling up.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<File> {
  // If not an image or is SVG, don't touch it
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const maxWidth = options.maxWidth || 1920;
  const maxHeight = options.maxHeight || 1920;
  const quality = options.quality || 0.82;
  const outputMime = options.mimeType || 'image/webp';

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // fallback to original
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't help (e.g. already small), use original
              return resolve(file);
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '');
            const ext = outputMime === 'image/webp' ? 'webp' : 'jpg';
            const compressedFile = new File([blob], `${cleanName}.${ext}`, {
              type: outputMime,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}
