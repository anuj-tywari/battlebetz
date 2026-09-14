import { Platform, ImageURISource } from 'react-native';

// Type for image metadata
type ImageMetadata = {
  width: number;
  height: number;
  aspectRatio: number;
};

// Cache for image metadata
const metadataCache = new Map<string, ImageMetadata>();

// Cache for image URIs
const uriCache = new Map<string, string>();

/**
 * Get the correct URI for an image in the public folder
 */
export const getPublicImageUri = (path: string): string => {
  // Check cache first
  if (uriCache.has(path)) {
    return uriCache.get(path)!;
  }

  let uri: string;
  
  if (Platform.OS === 'web') {
    // For web, use the path directly
    uri = path;
  } else {
    // For native platforms, use require
    // This is a simplified example - in practice, you'd need to handle this differently
    uri = path;
  }

  // Cache the URI
  uriCache.set(path, uri);
  return uri;
};

/**
 * Preload an image and get its metadata
 */
export const preloadImage = async (path: string): Promise<ImageMetadata> => {
  // Check cache first
  if (metadataCache.has(path)) {
    return metadataCache.get(path)!;
  }

  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const img = new Image();
      img.onload = () => {
        const metadata = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        };
        metadataCache.set(path, metadata);
        resolve(metadata);
      };
      img.onerror = reject;
      img.src = getPublicImageUri(path);
    } else {
      // For native platforms, use Image.getSize
      const uri = getPublicImageUri(path);
      Image.getSize(
        uri,
        (width, height) => {
          const metadata = {
            width,
            height,
            aspectRatio: width / height
          };
          metadataCache.set(path, metadata);
          resolve(metadata);
        },
        reject
      );
    }
  });
};

/**
 * Get image source with proper configuration
 */
export const getImageSource = (path: string): ImageURISource => {
  const uri = getPublicImageUri(path);
  const metadata = metadataCache.get(path);

  return {
    uri,
    width: metadata?.width,
    height: metadata?.height,
  };
};

/**
 * Clear image caches
 */
export const clearImageCaches = () => {
  metadataCache.clear();
  uriCache.clear();
};