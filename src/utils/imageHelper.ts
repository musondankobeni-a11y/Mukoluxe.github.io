/**
 * Luxury Asset Path Resolver & Resilient Image Helper
 * Ensures all cocktail & bar photos resolve directly from /public/images/
 * in both development and production (Vercel, Netlify, GitHub Pages).
 */

export const resolveImageUrl = (path?: string | null): string => {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '/images/cocktail_signature_blend.jpg';
  }

  const clean = path.trim();

  // If already a base64 data-url or remote https url
  if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // Rewrite any legacy /src/assets/images/ paths
  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/images/');
  }
  if (clean.startsWith('src/assets/images/')) {
    return clean.replace('src/assets/images/', '/images/');
  }

  // Ensure leading slash
  if (!clean.startsWith('/')) {
    return '/' + clean;
  }

  return clean;
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = '/images/cocktail_signature_blend.jpg'
) => {
  const target = e.currentTarget;
  target.onerror = null; // Prevent loop
  if (!target.src.endsWith(fallback)) {
    target.src = fallback;
  }
};
