import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config/config";

cloudinary.config({
  cloud_name: config.cloud_name!,
  api_key: config.api_key!,
  api_secret: config.api_secret!,
});

const DEFAULT_FOLDER = "properties";
const UPLOAD_TIMEOUT_MS = 60000; // optional: 60s timeout for uploads

/**
 * Upload a single image to Cloudinary.
 * Supports string (URL/base64/path) or Buffer (e.g., from Multer).
 * Returns the secure Cloudinary URL or null if failed.
 */
export const uploadImageToCloudinary = async (
  file: string | Buffer,
  folder: string = DEFAULT_FOLDER,
  timeout: number = UPLOAD_TIMEOUT_MS
): Promise<string | null> => {
  try {
    const options = { folder, resource_type: "image" as const };

    const uploadPromise = typeof file === "string"
      ? cloudinary.uploader.upload(file, options)
      : new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
            if (err || !result) reject(err);
            else resolve(result);
          });
          uploadStream.end(file);
        });

    const result = await Promise.race([
      uploadPromise,
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Cloudinary upload timeout")), timeout)
      ),
    ]);

    if (result && typeof (result as UploadApiResponse).secure_url === "string") {
      return (result as UploadApiResponse).secure_url;
    }

    return null;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

/**
 * Upload multiple images to Cloudinary.
 * Returns an array of secure URLs.
 */
export const uploadMultipleImagesToCloudinary = async (
  files: (string | Buffer)[],
  folder: string = DEFAULT_FOLDER
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const url = await uploadImageToCloudinary(file, folder);
    if (url) uploadedUrls.push(url);
  }

  return uploadedUrls;
};

/**
 * Delete an image from Cloudinary using its URL.
 * Automatically extracts the public ID.
 */
export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
      console.warn("Could not extract public_id from URL:", imageUrl);
      return;
    }

    // Remove everything before 'upload' + version (vxxxx)
    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension (.jpg, .png, etc.)

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
