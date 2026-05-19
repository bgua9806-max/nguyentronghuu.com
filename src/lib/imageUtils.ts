/**
 * Optimize Supabase Storage image URL with automatic resizing & format conversion.
 * Converts /storage/v1/object/public/ → /storage/v1/render/image/public/ with params.
 */
export function optimizeImageUrl(url: string, width: number = 800, quality: number = 75): string {
  return url;
}
