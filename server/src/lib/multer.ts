import multer, { StorageEngine } from "multer";

// Configure Multer to store files in memory as Buffers
const storage: StorageEngine = multer.memoryStorage();

/**
 * File filter to ensure only valid image types are uploaded
 */
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, png, jpg, webp) are allowed!"));
  }
};

/**
 * Multer instance configured for image uploads
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
