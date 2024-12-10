import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

export default upload;
