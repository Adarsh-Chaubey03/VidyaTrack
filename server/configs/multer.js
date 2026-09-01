import multer from "multer";

// Files are stored in a temp location on disk; Cloudinary upload reads from
// the path and the temp file is cleaned up by Cloudinary's Node SDK automatically.
const storage = multer.diskStorage({});

const upload = multer({
    storage,
    limits: {
        // 10 MB hard limit per file.
        // Cloudinary free tier supports up to 10 MB per asset for images/PDFs.
        // Without this limit, an attacker could upload arbitrarily large files,
        // consuming server memory/disk and stalling other requests.
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        // Allow images and PDFs only (covers course thumbnails, educator docs, blog images).
        const allowed = /^image\/(jpeg|png|gif|webp|svg\+xml)$|^application\/pdf$/;
        if (allowed.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: jpeg, png, gif, webp, svg, pdf`));
        }
    },
});

export default upload;
