// src/utils/image.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Extracts the filename from a full path or URL and 
 * returns the backend proxy URL for the image.
 */
export const getPropertyImageUrl = (propertyId: number, rawPath?: string) => {
  if (!rawPath) return "/placeholder.jpg";

  // If rawPath is "https://bucket.s3.com/folder/photo.jpg", 
  // imageKey becomes "photo.jpg"
  const imageKey = rawPath.includes("/")
    ? rawPath.split("/").pop()
    : rawPath;

  return `${API_BASE_URL}/api/properties/${propertyId}/images/${imageKey}`;
};