// src/utils/image.ts

/**
 * Returns the direct S3 public URL for an image.
 */
export const getPropertyImageUrl = (propertyId: number, rawPath?: string) => {
  if (!rawPath) return "/placeholder.jpg";

  // If the database already stored the full S3 URL, just use it
  if (rawPath.startsWith("http")) {
    return rawPath;
  }

  // Otherwise, construct it manually using your bucket and region info
  const BUCKET_NAME = "lm-propertymanagement";
  const REGION = "us-east-1";

  // Format: https://BUCKET.s3.REGION.amazonaws.com/properties/ID/FILENAME
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/properties/${propertyId}/${rawPath}`;
};